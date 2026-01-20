import { Page, expect } from '@playwright/test';

export class FtlShipmentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openBuildShipment() {
    // Aguarda o botão "Build Shipment" estar presente no DOM
    await this.page.locator('//*[text()="Build Shipment"]/../..').waitFor();

    // Aguarda o texto "Loading Shipments..." desaparecer; se ainda estiver visível após o timeout, recarrega a página e aguarda novamente
    try {
      await expect(this.page.getByText('Loading Shipments...', { exact: false })).toBeHidden({ timeout: 10000 });
    } catch {
      await this.page.reload();
      await expect(this.page.getByText('Loading Shipments...', { exact: false })).toBeHidden({ timeout: 10000 });
    }

    // Garante que o botão está visível e clica nele
    await this.page.locator('//*[text()="Build Shipment"]/../..').waitFor({ state: 'visible' });
    await this.page.locator('//*[text()="Build Shipment"]/../..').click();
    
    // Aguarda a página de criação de carga (build shipment) carregar completamente
    await this.page.waitForLoadState('domcontentloaded');
  }


  async fillCustomerAndPricing() {
    // Localiza e preenche o campo de cliente
    const customerInput = this.page.locator('input[data-placeholder="Customer"]');

    await customerInput.waitFor({ state: 'visible' });
    await customerInput.click();
    await this.page.waitForTimeout(1000); // Aguarda o foco
    await this.page.keyboard.type('Wesley Company');
    await this.page.waitForTimeout(1000);
    
    // Seleciona a opção "Wesley Company" na lista
    const wesleyCompanyOption = this.page.getByText('Wesley Company', { exact: true });
    await wesleyCompanyOption.waitFor({ state: 'visible', timeout: 15000 });
    await wesleyCompanyOption.click();
    await this.page.waitForTimeout(1000);

    // Preenche o preço do cliente
    await this.page
      .getByRole('textbox', { name: 'Customer Price' })
      .fill('9000.');
    await this.page.waitForTimeout(1000);

    // Seleciona o representante do cliente
    await this.page.locator('div').filter({ hasText: /^Customer Representative$/ }).nth(1).click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);

    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);

    // Fecha o overlay se necessário (clicando fora)
    await this.page.locator('.cdk-overlay-backdrop').click();
    await this.page.waitForTimeout(1000);

    // Clica em elementos específicos para avançar no fluxo (seletores específicos do Angular/Material)
    await this.page.locator('#mat-select-value-9').click();
    await this.page.waitForTimeout(1000);

    // Seleciona "Book & Tender"
    await this.page.getByText('Book & Tender').click();
    await this.page.waitForTimeout(1000);

    // Seleciona o tipo de serviço
    await this.page.getByRole('combobox', { name: 'Service Type' }).locator('span').click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText('- Service Expedite').click();
    await this.page.waitForTimeout(1000);
  }

  // Método utilitário para formatar datas (MM/DD/YYYY)
  getFormattedDate(daysToAdd: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  async fillPickupDetails() {
    const todayDate = this.getFormattedDate(0);
    const futureDate = this.getFormattedDate(5);

    // Preenche o nome do local de coleta (Pickup)
    await this.page.locator('//*[contains(@class, "pickup")]//*[text()="Location Name (search by name or ID)"]/../../preceding-sibling::input').fill('Best Buy Xbox DC');
    
    // Seleciona a primeira opção de local encontrada
    const locationOption = this.page.locator('.location-name').first();
    await locationOption.waitFor({ state: 'visible' });
    await locationOption.click();

    // Seleciona o tipo de agendamento (Appointment Type)
    const appointmentTypeDropdown = this.page.locator('//*[contains(@class, "pickup")]//*[@placeholder="Appointment Type"]').first();
    await appointmentTypeDropdown.click();
    
    // Escolhe "First Come First Served"
    const fcfsOption = this.page.getByRole('option', { name: 'First Come First Served' });
    await fcfsOption.waitFor({ state: 'visible' });
    await fcfsOption.click();
    await this.page.waitForTimeout(1000);

    // Preenche a data de início da coleta (Pickup Start Date)
    const pickupStartDate = this.page.locator('input[formcontrolname="startDate"]').first();

    await pickupStartDate.waitFor({ state: 'visible', timeout: 15000 });
    await pickupStartDate.fill(todayDate);
        await this.page.waitForTimeout(1000);
    await pickupStartDate.press('Escape'); // Fecha o calendário se abrir


    // Preenche a hora de início da coleta (Pickup Start Time)
    const pickupStartTime = this.page.locator(
      'input[data-placeholder="Pickup Start Time"]'
    );

    await pickupStartTime.waitFor({ state: 'visible', timeout: 15000 });
    await pickupStartTime.fill('06:00');
        await this.page.waitForTimeout(1000);
    await pickupStartTime.press('Escape');


    // Preenche a data de término da coleta (Pickup End Date)
    const pickupEndDate = this.page.locator('input[formcontrolname="endDate"]').first();

    await pickupEndDate.waitFor({ state: 'visible', timeout: 15000 });
    await pickupEndDate.fill(futureDate);
        await this.page.waitForTimeout(1000);
    await pickupEndDate.press('Escape');


    // Preenche a hora de término da coleta (Pickup End Time)
    const pickupEndTime = this.page.locator(
      'input[data-placeholder="Pickup End Time"]'
    );

    await pickupEndTime.waitFor({ state: 'visible', timeout: 15000 });
    await pickupEndTime.fill('23:00');
        await this.page.waitForTimeout(1000);
    await pickupEndTime.press('Escape');

  }

  async fillDropoffDetails() {
    const futureDate = this.getFormattedDate(5);
    // Preenche o nome do local de entrega (Dropoff)
    const locationInput = this.page.locator('//*[contains(@class, "dropoff")]//*[text()="Location Name (search by name or ID)"]/../../preceding-sibling::input');

    await locationInput.waitFor({ state: 'visible', timeout: 15000 });
    await locationInput.click();

    await locationInput.fill('new york');

    // Seleciona a primeira opção de local encontrada
    const firstOption = this.page.locator('.cdk-overlay-pane .location-name').first();
    await firstOption.waitFor({ state: 'visible', timeout: 15000 });
    await firstOption.click();


    // Seleciona o tipo de agendamento para entrega
    await this.page.locator('//*[contains(@class, "dropoff")]//*[@placeholder="Appointment Type"]').click();

    const panel = this.page.locator('[role="listbox"].mat-select-panel');
    await panel.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('option', { name: 'First Come First Served' }).click();
    await this.page.waitForTimeout(1000);

    // Define data de entrega (Dropoff 1)
    const dropoffDate = this.getFormattedDate(2);
    const dropoff1Card = this.page.locator('mat-card-content', { hasText: 'Dropoff 1' }); 
    const dropoffStartDate = dropoff1Card.getByLabel('Start Date'); 
    
    await dropoffStartDate.waitFor({ state: 'visible', timeout: 15000 }); 
    await dropoffStartDate.fill(dropoffDate); 
    await this.page.waitForTimeout(1000);
    await dropoffStartDate.press('Enter');


    // Preenche a hora de início da entrega
    const dropoffStartTime = this.page.locator(
      'input[data-placeholder="Dropoff Start Time"]'
    );

    
    await dropoffStartTime.waitFor({ state: 'visible', timeout: 15000 });
    await dropoffStartTime.fill('06:00');
        await this.page.waitForTimeout(1000);
    await dropoffStartTime.press('Escape');


    // Preenche a data de término da entrega
    const dropoffEndDate = this.page.locator('input[formcontrolname="endDate"]').nth(1);

    await dropoffEndDate.waitFor({ state: 'visible', timeout: 15000 });
    await dropoffEndDate.fill(futureDate);
        await this.page.waitForTimeout(1000);
    await dropoffEndDate.press('Escape');


    // Preenche a hora de término da entrega
    const dropoffEndTime = this.page.locator(
      'input[data-placeholder="Dropoff End Time"]'
    );

    await dropoffEndTime.waitFor({ state: 'visible', timeout: 15000 });
    await dropoffEndTime.fill('23:00');
        await this.page.waitForTimeout(1000);
    await dropoffEndTime.press('Enter');

  }


  async fillLoadDetails() {
    // Preenche o peso total da carga
    await this.page
      .getByRole('textbox', { name: 'Total Load Weight (lbs)' })
      .click();

    await this.page
      .getByRole('textbox', { name: 'Total Load Weight (lbs)' })
      .fill('9000');

    // Seleciona o código da mercadoria (Commodity Code)
    await this.page
      .locator('div')
      .filter({ hasText: /^Commodity Code \*$/ })
      .nth(2)
      .click();

    await this.page.getByText('METALS - METALS').click();

    // Seleciona o tipo de equipamento (Equipment Type)
    await this.page
      .locator('div')
      .filter({ hasText: /^Equipment Type \*$/ })
      .nth(2)
      .click();

    await this.page.getByText("48' Dry Van", { exact: true }).click();

    await this.page.keyboard.press('Escape');
  }

  async tenderToCarrier() {
    // Clica no botão Submit para criar a carga
    const submitButton = this.page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible', timeout: 15000 });
    await submitButton.click();
    await this.page.waitForTimeout(1000);

    // Aguarda o cabeçalho de opções de tender aparecer
    await expect(this.page.getByRole('heading', { name: 'Carrier Tender Options FTL' })).toBeVisible();
    
    // Busca e seleciona a transportadora (Carrier)
    await this.page.locator('div').filter({ hasText: /^Search Carrier \*$/ }).nth(3).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('combobox', { name: 'Search Carrier' }).fill('samba');
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: 'Samba Testes   - DOT# 951' }).click();
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000);
    
    // Seleciona o Operador (Operator) - Tentativa 1
    const operator1 = this.page.getByRole('combobox', { name: 'Operator' });
    await operator1.click();
    await operator1.clear();
    await operator1.type('Wesley', { delay: 100 });
    await operator1.press('Backspace'); // dispara o autocomplete removendo a última letra
    await this.page.waitForTimeout(1000); // Aguarda resultados do autocomplete
    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);

    // Seleciona o Operador (Operator) - Tentativa 2 (Redundância para garantir seleção)
    const operator2 = this.page.getByRole('combobox', { name: 'Operator' });
    await operator2.click();
    await operator2.clear();
    await operator2.type('Wesley', { delay: 100 });
    await operator2.press('Backspace'); 
    await this.page.waitForTimeout(1000); 
    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);
    
    // Preenche o preço da transportadora (Carrier Price)
    const priceInput = this.page.getByRole('textbox', { name: 'Enter Carrier Price' });
    await priceInput.click();
    await priceInput.fill('9,0000.');
    await priceInput.blur();
    
    await this.page.waitForTimeout(1000); // Aguarda UI estabilizar
    
    // Seleciona o Gerente de Frota (Fleet Manager)
    const fleetManagerSelect = this.page.getByText('Select Fleet ManagerSelect');
    await fleetManagerSelect.waitFor({ state: 'visible', timeout: 30000 });
    await fleetManagerSelect.click();
    await this.page.waitForTimeout(1000);
    
    const fleetManagerOption = this.page.getByText('Wesley leocadio', { exact: true });
    await fleetManagerOption.waitFor({ state: 'visible' });
    await fleetManagerOption.click();
    await this.page.waitForTimeout(1000);

    // Clica no botão Tender para finalizar
    await this.page.getByRole('button', { name: 'Tender' }).click();
    await this.page.waitForTimeout(1000);
  }
}
