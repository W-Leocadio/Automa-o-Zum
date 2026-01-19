import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';

test('Login Stage Broker', async ({ page }) => {
  const loginPage = new LoginPage(page, 'broker');

  await loginPage.goto(process.env.BASE_URL_BROKER!);
  await loginPage.login(process.env.BROKER_USER_EMAIL!, process.env.BROKER_USER_PASSWORD!);

  await expect(page).toHaveURL(/.*\/main/, { timeout: 15000 });

  await page.context().storageState({ path: 'storageStateBroker.json' });
});
