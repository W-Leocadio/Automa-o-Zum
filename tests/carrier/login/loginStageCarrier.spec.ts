import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';

test('Login Stage Carrier', async ({ page }) => {
  const loginPage = new LoginPage(page, 'carrier');

  await loginPage.goto(process.env.BASE_URL_CARRIER!);
  await loginPage.login(process.env.CARRIER_USER_EMAIL!, process.env.CARRIER_USER_PASSWORD!);

  await expect(page).toHaveURL(/.*\/main\/shipments/, { timeout: 15000 });
});
