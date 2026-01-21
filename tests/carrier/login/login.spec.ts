import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';

test.describe('Carrier Login', () => {

  test.describe('Success Scenarios', () => {
    test('Should login successfully with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page, 'carrier');
      await loginPage.goto(process.env.BASE_URL_CARRIER!);
      await loginPage.login(process.env.CARRIER_USER_EMAIL!, process.env.CARRIER_USER_PASSWORD!);
      await expect(page).toHaveURL(/.*\/main\/shipments/, { timeout: 30000 });
    });
  });

  test.describe('Error Scenarios', () => {
    test('Should display error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page, 'carrier');
      await loginPage.goto(process.env.BASE_URL_CARRIER!);

      // Attempt login with valid email but wrong password
      const email = process.env.CARRIER_USER_EMAIL || 'wleocadio@zuumapp.com';
      await loginPage.login(email, 'wrong_password_123');

      // Assert the error message observed in the recording
      await expect(loginPage.getInvalidCredentialsError()).toBeVisible();
    });

    test('Should display error for invalid email format', async ({ page }) => {
      const loginPage = new LoginPage(page, 'carrier');
      await loginPage.goto(process.env.BASE_URL_CARRIER!);

      // Fill with invalid email format (as seen in recording: 'wleocadio@zuumapp.')
      await loginPage.emailInput.click();
      await loginPage.emailInput.type('wleocadio@zuumapp.');
      
      // Trigger validation (clicking password field acts as blur)
      await loginPage.passwordInput.fill('250328123wW!');

      // Assert the error message for format
      // BUG: the system does not show any validation message for malformed email
      await expect(loginPage.getInvalidEmailFormatError()).toBeVisible();
      // TODO: remove or adjust assertion once the bug is fixed
    });

    test('Should handle empty fields', async ({ page }) => {
      const loginPage = new LoginPage(page, 'carrier');
      await loginPage.goto(process.env.BASE_URL_CARRIER!);

      // Leave fields empty (just ensure they are clear)
      await loginPage.emailInput.clear();
      await loginPage.passwordInput.clear();
      // Click outside to ensure blur occurs
      await page.click('body');

      // Asserts that the login button is disabled
      await expect(loginPage.loginButton).toBeDisabled();
    });
  });

});
