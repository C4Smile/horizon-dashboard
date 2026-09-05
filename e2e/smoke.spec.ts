import { test, expect } from "@playwright/test";

// ─── Credentials (set via env in CI). The shared sign in view takes an
// email, the server matches it against either email or username ─────────────────────────────────────────
const USER = process.env.E2E_USER ?? "administrador@email.com";
const PASSWORD = process.env.E2E_PASSWORD ?? "horizon123";

// ─── Smoke tests ─────────────────────────────────────────────────────────────

test.describe("E2E Smoke – shell", () => {
  test.describe.configure({ mode: "serial" });

  test("unauthenticated user lands on the sign-in page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("sign-in page renders its form", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.locator('input[type="password"]')).toBeVisible({
      timeout: 10_000,
    });
  });

  test("sign-in with valid credentials reaches the dashboard", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page.locator("#sign-in-email").fill(USER);
    await page.locator("#sign-in-password").fill(PASSWORD);
    await page.getByRole("button", { name: /enviar|entrar|submit/i }).click();

    await expect(page).not.toHaveURL(/\/auth/, { timeout: 15_000 });
  });

  test("the drawer offers sign out and it ends the session", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page.locator("#sign-in-email").fill(USER);
    await page.locator("#sign-in-password").fill(PASSWORD);
    await page.getByRole("button", { name: /enviar|entrar|submit/i }).click();
    await expect(page).not.toHaveURL(/\/auth/, { timeout: 15_000 });

    await page.getByLabel("Abrir menú").first().click();

    const signOut = page.getByRole("link", { name: "Cerrar sesión" });
    await expect(signOut).toBeVisible({ timeout: 10_000 });

    await signOut.click();
    await expect(page).toHaveURL(/\/auth/, { timeout: 15_000 });
  });
});
