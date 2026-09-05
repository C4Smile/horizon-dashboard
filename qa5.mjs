import { chromium } from "@playwright/test";
const base = "https://localhost:5198";
const browser = await chromium.launch();
const page = await (await browser.newContext({ ignoreHTTPSErrors: true })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
page.on("response", (r) => { if (r.url().includes(":3010") && r.request().method() !== "GET") console.log("   API", r.request().method(), r.status(), r.url().replace("http://localhost:3010","")); });
await page.goto(`${base}/auth`);
await page.locator("#sign-in-email").fill("administrador@email.com");
await page.locator("#sign-in-password").fill("horizon123");
await page.getByRole("button", { name: /enviar|entrar|submit/i }).click();
await page.waitForTimeout(2500);
await page.goto(`${base}/game/ships/9`); await page.waitForTimeout(2200);

for (const name of ["Costo", "Manutención", "Requerimientos tecnológicos", "Información"]) {
  errs.length = 0;
  await page.locator("a.tab").filter({ hasText: new RegExp(`^${name}$`) }).first().click();
  await page.waitForTimeout(1200);
  const plus = await page.locator("div.absolute.bottom-6 button").count();
  console.log(name.padEnd(30), "| + :", plus, "| filas:", await page.locator("img.rounded-full").count(), "| errores:", errs.slice(0,1).join("").slice(0,120) || "-");
}
// and the dialog still saves from a tab
await page.locator("a.tab").filter({ hasText: /^Costo$/ }).first().click();
await page.waitForTimeout(1000);
await page.locator("div.absolute.bottom-6 button").first().click();
await page.waitForTimeout(800);
const dlg = page.locator(".sito-ui-dialog, [role=dialog]").first();
console.log("dialogo desde pestaña:", await dlg.isVisible().catch(() => false));
await browser.close();
