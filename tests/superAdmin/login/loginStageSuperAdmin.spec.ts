import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';

test('Login Stage Super Admin', async ({ page }) => {
  const loginPage = new LoginPage(page, 'superadmin');

  await loginPage.goto(process.env.BASE_URL_SUPERADMIN!);
  await loginPage.login(process.env.SUPERADMIN_USER_EMAIL!, process.env.SUPERADMIN_USER_PASSWORD!);

  await expect(page).toHaveURL(/.*\/main/, { timeout: 15000 });
});
