import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await (await browser.newContext({ ignoreHTTPSErrors: true })).newPage();
await page.goto("https://localhost:5198/auth");
await page.locator("#sign-in-email").fill("administrador@email.com");
await page.locator("#sign-in-password").fill("horizon123");
await page.getByRole("button", { name: /enviar|entrar|submit/i }).click();
await page.waitForTimeout(2500);
await page.goto("https://localhost:5198/game/ships/9"); await page.waitForTimeout(2200);
const info = await page.locator("button, a").evaluateAll((els) =>
  els.map((e) => ({ tag: e.tagName, txt: (e.textContent||"").trim().slice(0,32), cls: e.className.slice(0,60) }))
     .filter((x) => /Costo|Manutenci|Informaci/.test(x.txt)));
console.log(JSON.stringify(info, null, 1));
await browser.close();
