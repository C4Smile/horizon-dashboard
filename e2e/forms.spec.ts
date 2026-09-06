import { test, expect, Page, Response } from "@playwright/test";

// utils
import { dropRows } from "./cleanup";

// ─── Credentials (set via env in CI). The shared sign in view takes an
// email, the server matches it against either email or username ─────────────────────────────────────────
const USER = process.env.E2E_USER ?? "administrador@email.com";
const PASSWORD = process.env.E2E_PASSWORD ?? "horizon123";

/**
 * Signs in and leaves the page on the dashboard
 */
async function signIn(page: Page) {
  await page.goto("/auth");
  await page.locator("#sign-in-email").fill(USER);
  await page.locator("#sign-in-password").fill(PASSWORD);
  await page.getByRole("button", { name: /enviar|entrar|submit/i }).click();
  await expect(page).not.toHaveURL(/\/auth/, { timeout: 15_000 });
}

type FormCase = {
  route: string;
  endpoint: string;
  /** where the row lands, so the run can drop what it created */
  table: string;
  fields: Record<string, string>;
  /** forms with a type dropdown, the first option is picked */
  type?: boolean;
};

const cases: FormCase[] = [
  {
    route: "/game/resources/new",
    endpoint: "/resources",
    table: "resources",
    fields: { baseFactor: "3" },
  },
  {
    route: "/game/skills/new",
    endpoint: "/skills",
    table: "skills",
    fields: {},
  },
  {
    route: "/game/building-types/new",
    endpoint: "/buildingTypes",
    table: "building-types",
    fields: {},
  },
  {
    route: "/game/tech-types/new",
    endpoint: "/techTypes",
    table: "tech-types",
    fields: {},
  },
  {
    route: "/game/cannons/new",
    endpoint: "/cannons",
    table: "cannons",
    fields: { weight: "900", baseDamage: "30", creationTime: "8" },
  },
  {
    route: "/game/ships/new",
    endpoint: "/ships",
    table: "ships",
    fields: {
      capacity: "100",
      knots: "12",
      minCrew: "10",
      bestCrew: "40",
      maxCrew: "60",
      guns: "24",
      hull: "300",
      creationTime: "20",
    },
  },
  {
    route: "/game/buildings/new",
    endpoint: "/buildings",
    table: "buildings",
    fields: { creationTime: "10" },
    type: true,
  },
  {
    route: "/game/techs/new",
    endpoint: "/techs",
    table: "techs",
    fields: { creationTime: "5" },
    type: true,
  },
];

/** ids the run created, per table, dropped once it is over */
const created = new Map<string, number[]>();

/**
 * Notes down a created row so the teardown can drop it
 * @param form - the case that created it
 * @param response - the create answer, the saved row inside an array
 */
async function remember(form: FormCase, response: Response) {
  if (!response.ok()) return;

  const [entity] = await response.json();
  if (typeof entity?.id !== "number") return;

  created.set(form.table, [...(created.get(form.table) ?? []), entity.id]);
}

/**
 * Fills a create form and submits it
 * @returns the create response
 */
async function fillAndSave(page: Page, form: FormCase, name: string) {
  await page.goto(form.route);
  await expect(page.locator("#name")).toBeEnabled({ timeout: 15_000 });

  await page.locator("#name").fill(name);
  for (const [id, value] of Object.entries(form.fields))
    await page.locator(`#${id}`).fill(value);

  if (form.type) {
    await expect
      .poll(() => page.locator("#type option").count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
    await page.locator("#type").selectOption({ index: 0 });
  }

  const saved = page.waitForResponse(
    (r) => r.url().includes(form.endpoint) && r.request().method() === "POST",
    { timeout: 15_000 },
  );
  await page.getByRole("button", { name: /guardar|save/i }).click();

  const response = await saved;
  await remember(form, response);
  return response;
}

// ─── Forms ───────────────────────────────────────────────────────────────────
// These need the api running: PORT=3010 pnpm start on horizon-sever

test.describe("E2E – entity forms save", () => {
  // without this the tables grow by nine entities every run
  test.afterAll(() => {
    // reversed: buildings and techs go before the types they point at, and
    // resources last, so no foreign key stands in the way
    for (const form of cases.toReversed())
      dropRows(form.table, created.get(form.table) ?? []);
  });

  for (const form of cases) {
    test(`${form.route} creates through the api`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      await signIn(page);

      const response = await fillAndSave(page, form, `E2E ${Date.now()}`);
      expect(response.status()).toBe(201);
      expect(errors).toEqual([]);
    });
  }

  test("a created resource can be edited back", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await signIn(page);

    const response = await fillAndSave(page, cases[0], `E2E ${Date.now()}`);
    const [resource] = await response.json();

    const name = `E2E editado ${Date.now()}`;
    await page.goto(`/game/resources/${resource.id}`);
    await expect(page.locator("#name")).not.toHaveValue("", {
      timeout: 15_000,
    });
    await page.locator("#name").fill(name);

    const saved = page.waitForResponse(
      (r) =>
        r.url().includes(`/resources/${resource.id}`) &&
        r.request().method() === "PATCH",
      { timeout: 15_000 },
    );
    await page.getByRole("button", { name: /guardar|save/i }).click();
    expect((await saved).status()).toBe(200);

    await page.goto("/game/resources");
    await expect(page.getByText(name)).toBeVisible({ timeout: 15_000 });

    expect(errors).toEqual([]);
  });
});
