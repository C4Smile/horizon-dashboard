import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Credentials = {
  host: string;
  port: string;
  name: string;
  user: string;
  password: string;
};

/**
 * The api only soft deletes, so a row removed through it stays in every list,
 * greyed out with a restore action. Cleaning up for real means going to the
 * database, and the server keeps its (gitignored) credentials next door.
 * @returns the credentials, env first, or null when neither source has them
 */
function credentials(): Credentials | null {
  let file = "";
  try {
    file = readFileSync(
      resolve(process.cwd(), "../horizon-sever/config.yaml"),
      "utf8",
    );
  } catch {
    // the server may live elsewhere, the env vars can still carry it
  }

  const block = /^db:\n((?: {2}.*\n)*)/m.exec(file)?.[1] ?? "";
  const field = (key: string) =>
    new RegExp(`^ +${key}: *"?([^"\n]*?)"? *$`, "m").exec(block)?.[1];

  const password = process.env.E2E_DB_PASSWORD ?? field("password");
  if (password === undefined) return null;

  return {
    host: process.env.E2E_DB_HOST ?? field("url") ?? "127.0.0.1",
    port: process.env.E2E_DB_PORT ?? field("port") ?? "3306",
    name: process.env.E2E_DB_NAME ?? field("name") ?? "horizon",
    user: process.env.E2E_DB_USER ?? field("user") ?? "root",
    password,
  };
}

/**
 * Drops the rows a run created, so the tables do not grow by nine entities
 * every time the suite runs
 * @param table - table the rows live in
 * @param ids - ids the run created
 */
export function dropRows(table: string, ids: number[]) {
  if (!ids.length) return;

  const db = credentials();
  if (!db) {
    console.warn(`e2e: no database credentials, ${table} ${ids} left behind`);
    return;
  }

  try {
    execFileSync(
      "mysql",
      [
        `-h${db.host}`,
        `-P${db.port}`,
        `-u${db.user}`,
        `-p${db.password}`,
        db.name,
        "-e",
        // through Number, so nothing but digits ever reaches the statement
        `delete from \`${table}\` where id in (${ids.map(Number).join(",")})`,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
  } catch (error) {
    console.warn(`e2e: could not drop ${table} ${ids}`, String(error));
  }
}
