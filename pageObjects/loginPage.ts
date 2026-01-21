import { Page, Locator } from '@playwright/test';

export type LoginVariant = 'broker' | 'superadmin' | 'carrier';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  private variant: LoginVariant;

  constructor(page: Page, variant: LoginVariant = 'broker') {
    this.page = page;
    this.variant = variant;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Define o seletor do botão de login dependendo da variante (carrier usa 'Login', broker usa 'LOG IN')
    // Defines the login button selector depending on the variant (carrier uses 'Login', broker uses 'LOG IN')
    if (variant === 'carrier') {
      this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    } else {
      this.loginButton = page.getByRole('button', { name: 'LOG IN', exact: true });
    }
  }

  // Navega para a URL especificada
  // Navigates to the specified URL
  async goto(url: string) {
    await this.page.goto(url);
  }

  // Realiza o login preenchendo email, senha e clicando no botão
  // Performs login by filling in email, password and clicking the button
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  // Retorna o locator da mensagem de erro de credenciais inválidas
  // Returns the locator for invalid credentials error message
  getInvalidCredentialsError(): Locator {
    return this.page.getByText('Invalid email or password');
  }

  // Retorna o locator da mensagem de erro de formato de email inválido
  // Returns the locator for invalid email format error message
  getInvalidEmailFormatError(): Locator {
    if (this.variant === 'carrier') {
      return this.page.getByText('Please enter a valid email address');
    }
    // Broker e Super Admin usam a mesma mensagem
    return this.page.getByText('Email format invalid');
  }
}
