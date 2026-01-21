import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';

test.describe('Super Admin Login', () => {

  test.describe('Success Scenarios', () => {
    test('Should login successfully with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page, 'superadmin');
      await loginPage.goto(process.env.BASE_URL_SUPERADMIN!);
      await loginPage.login(process.env.SUPERADMIN_USER_EMAIL!, process.env.SUPERADMIN_USER_PASSWORD!);
      await expect(page).toHaveURL(/.*\/main/, { timeout: 15000 });
    });
  });

  test.describe('Error Scenarios', () => {
    test('Should display error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page, 'superadmin');
      await loginPage.goto(process.env.BASE_URL_SUPERADMIN!);

      // Attempt login with valid email but wrong password
      const email = process.env.SUPERADMIN_USER_EMAIL || 'wleocadio@zuumapp.com';
      await loginPage.login(email, 'wrong_password_123');

      // Assert the error message (assuming same as Carrier)
      await expect(loginPage.getInvalidCredentialsError()).toBeVisible();
    });

    test('Should display error for invalid email format', async ({ page }) => {
      const loginPage = new LoginPage(page, 'superadmin');
      await loginPage.goto(process.env.BASE_URL_SUPERADMIN!);

      // Fill with invalid email format
      await loginPage.emailInput.fill('wleocadio@zuumapp.');
      
      // Trigger validation (clicking password field acts as blur)
      await loginPage.passwordInput.click();

      // Assert the error message for format
      await expect(loginPage.getInvalidEmailFormatError()).toBeVisible();
    });

    test('Should handle empty fields', async ({ page }) => {
      const loginPage = new LoginPage(page, 'superadmin');
      await loginPage.goto(process.env.BASE_URL_SUPERADMIN!);

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
