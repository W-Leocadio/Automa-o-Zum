import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';
import * as fs from 'fs';
import * as path from 'path';

// Helper function for loading validation with reload logic
async function validateLoading(page: Page) {
  // Usando um seletor mais específico para evitar conflito com labels estáticos como "Loading Type"
  const loading = page.getByText('Loading Shipments...', { exact: false });
  try {
    // Tenta esperar o loading aparecer
    await loading.waitFor({ state: 'visible', timeout: 5000 });
  } catch (e) {
    // Pode não aparecer se for muito rápido
  }

  try {
    // Espera sumir por 5 segundos conforme solicitado
    await expect(loading).toBeHidden({ timeout: 5000 });
  } catch (e) {
    console.log('Loading state persisted; reloading page...');
    await page.reload();
    
    // Após reload, espera o loading aparecer e sumir novamente
    try {
      await loading.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      // Pode não aparecer
    }
    await expect(loading).toBeHidden({ timeout: 30000 });
  }
}

test.describe('Broker Settings - Password Change', () => {
  test('Should change password successfully and update .env', async ({ page }) => {
    // Aumentar timeout para garantir que o processo completo (incluindo leitura/escrita de arquivo e reloads) funcione
    test.setTimeout(120000);

    // 1. Ler a senha atual diretamente do arquivo .env para garantir a fonte da verdade
    const envPath = path.resolve(__dirname, '../../../.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Regex para encontrar a senha do broker
    const passwordMatch = envContent.match(/BROKER_USER_PASSWORD=(.+)/);
    if (!passwordMatch) {
      throw new Error('BROKER_USER_PASSWORD not found in .env file');
    }
    
    const currentPassword = passwordMatch[1].trim();
    console.log(`Current password read from .env: ${currentPassword}`);

    // 2. Gerar nova senha única
    // Formato: Zuumapp + timestamp + ! (ex: Zuumapp1700000000000!)
    const newPassword = `Zuumapp${Date.now()}!`;
    console.log(`Generated new password: ${newPassword}`);

    // 3. Login com a senha atual
    console.log('Navigating to login page...');
    const loginPage = new LoginPage(page, 'broker');
    await loginPage.goto(process.env.BASE_URL_BROKER!);
    console.log('Logging in with current password...');
    await loginPage.login(process.env.BROKER_USER_EMAIL!, currentPassword);
    await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });
    await validateLoading(page);
    console.log('Login successful. Navigating to Settings...');

    // 4. Navegar para Settings -> Account
    // Usando snippet fornecido pelo usuário
    await page.getByText('Settings keyboard_arrow_right').click(); 
    await page.getByRole('link', { name: 'Account' }).click();
    await validateLoading(page);
    console.log('Navigated to Account settings.');

    // 5. Alterar a senha
    console.log('Changing password...');
    await page.getByRole('button', { name: 'Change Password' }).click(); 
    
    // Preencher senha atual
    await page.getByRole('textbox', { name: 'Current Password' }).fill(currentPassword); 
    
    // Preencher nova senha
    await page.getByRole('textbox', { name: 'New Password' }).click(); 
    await page.getByRole('textbox', { name: 'New Password' }).fill(newPassword); 
    
    // Confirmar nova senha
    await page.getByRole('textbox', { name: 'Confirm Password' }).click(); 
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(newPassword); 
    
    // Clicar em alterar
    await page.getByRole('button', { name: 'Change Password' }).click(); 

    // 6. Validar mensagem de sucesso
    await expect(page.getByText('Success! Your Password has')).toBeVisible();

    // 7. Atualizar o arquivo .env com a nova senha
    const newEnvContent = envContent.replace(
      `BROKER_USER_PASSWORD=${currentPassword}`,
      `BROKER_USER_PASSWORD=${newPassword}`
    );
    
    fs.writeFileSync(envPath, newEnvContent);
    console.log('Successfully updated .env file with new password.');

    // 8. Validar login com a nova senha
    // Realizar Logout via UI conforme solicitado
    console.log('Performing UI logout...');
    
    // Clicar no botão do usuário
    await page.locator('.user-button').click();
    
    // Clicar em Logout
    await page.getByText('Logout').click();
    
    // Validar modal de confirmação
    await expect(page.getByText('Are you sure you want to logout?')).toBeVisible();
    
    // Clicar em Confirm
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    // Validar se fez logout (Header e URL)
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(page).toHaveURL(/.*\/auth\/login/);
    
    // Tentar login com a NOVA senha
    console.log('Attempting re-login with new password...');
    await loginPage.login(process.env.BROKER_USER_EMAIL!, newPassword);
    await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });
  });
});
