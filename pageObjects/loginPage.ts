import { Page, Locator } from '@playwright/test';

export type LoginVariant = 'broker' | 'superadmin' | 'carrier';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page, variant: LoginVariant = 'broker') {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Define o seletor do botão de login dependendo da variante (carrier usa 'Login', broker usa 'LOG IN')
    if (variant === 'carrier') {
      this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    } else {
      this.loginButton = page.getByRole('button', { name: 'LOG IN', exact: true });
    }
  }

  // Navega para a URL especificada
  async goto(url: string) {
    await this.page.goto(url);
  }

  // Realiza o login preenchendo email, senha e clicando no botão
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }
}
