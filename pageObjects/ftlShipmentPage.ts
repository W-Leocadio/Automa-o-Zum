import { Page, expect } from '@playwright/test';

export class FtlShipmentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openBuildShipment() {
    // Aguarda o botão "Build Shipment" estar presente no DOM
    // Waits for the "Build Shipment" button to be present in the DOM
    await this.page.locator('//*[text()="Build Shipment"]/../..').waitFor();

    // Aguarda o texto "Loading Shipments..." desaparecer; se ainda estiver visível após o timeout, recarrega a página e aguarda novamente
    // Waits for the "Loading Shipments..." text to disappear; if still visible after timeout, reloads the page and waits again
    try {
      await expect(this.page.getByText('Loading Shipments...', { exact: false })).toBeHidden({ timeout: 10000 });
    } catch {
      await this.page.reload();
      await expect(this.page.getByText('Loading Shipments...', { exact: false })).toBeHidden({ timeout: 10000 });
    }

    // Garante que o botão está visível e clica nele
    // Ensures the button is visible and clicks it
    await this.page.locator('//*[text()="Build Shipment"]/../..').waitFor({ state: 'visible' });
    await this.page.locator('//*[text()="Build Shipment"]/../..').click();
    
    // Aguarda a página de criação de carga (build shipment) carregar completamente
    // Waits for the build shipment page to load completely
    await this.page.waitForLoadState('domcontentloaded');
  }


  async fillCustomerAndPricing() {
    // Localiza e preenche o campo de cliente
    // Locates and fills the customer field
    const customerInput = this.page.locator('input[data-placeholder="Customer"]');

    await customerInput.waitFor({ state: 'visible' });
    await customerInput.click();
    await this.page.waitForTimeout(1000); // Aguarda o foco / Waits for focus
    await this.page.keyboard.type('Wesley Company');
    await this.page.waitForTimeout(1000);
    
    // Seleciona a opção "Wesley Company" na lista
    // Selects the "Wesley Company" option from the list
    const wesleyCompanyOption = this.page.getByText('Wesley Company', { exact: true });
    await wesleyCompanyOption.waitFor({ state: 'visible', timeout: 15000 });
    await wesleyCompanyOption.click();
    await this.page.waitForTimeout(1000);

    // Preenche o preço do cliente
    // Fills the customer price
    await this.page
      .getByRole('textbox', { name: 'Customer Price' })
      .fill('9000.');
    await this.page.waitForTimeout(1000);

    // Seleciona o representante do cliente
    // Selects the customer representative
    await this.page.locator('div').filter({ hasText: /^Customer Representative$/ }).nth(1).click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);

    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);

    // Fecha o overlay se necessário (clicando fora)
    // Closes the overlay if necessary (clicking outside)
    await this.page.locator('.cdk-overlay-backdrop').click();
    await this.page.waitForTimeout(1000);

    // Clica em elementos específicos para avançar no fluxo (seletores específicos do Angular/Material)
    // Clicks on specific elements to proceed in the flow (Angular/Material specific selectors)
    await this.page.locator('#mat-select-value-9').click();
    await this.page.waitForTimeout(1000);

    // Seleciona "Book & Tender"
    // Selects the "Book & Tender" option
    await this.page.getByText('Book & Tender').click();
    await this.page.waitForTimeout(1000);

    // Seleciona o tipo de serviço
    // Selects the service type
    await this.page.getByRole('combobox', { name: 'Service Type' }).locator('span').click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText('- Service Expedite').click();
    await this.page.waitForTimeout(1000);
  }

  // Método utilitário para formatar datas (MM/DD/YYYY)
  // Utility method to format dates (MM/DD/YYYY)
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
    // Fills the pickup location name
    await this.page.locator('//*[contains(@class, "pickup")]//*[text()="Location Name (search by name or ID)"]/../../preceding-sibling::input').fill('Best Buy Xbox DC');
    
    // Seleciona a primeira opção de local encontrada
    // Selects the first found location option
    const locationOption = this.page.locator('.location-name').first();
    await locationOption.waitFor({ state: 'visible' });
    await locationOption.click();

    // Seleciona o tipo de agendamento (Appointment Type)
    // Selects the appointment type
    const appointmentTypeDropdown = this.page.locator('//*[contains(@class, "pickup")]//*[@placeholder="Appointment Type"]').first();
    await appointmentTypeDropdown.click();
    
    // Escolhe "First Come First Served"
    // Chooses "First Come First Served"
    const fcfsOption = this.page.getByRole('option', { name: 'First Come First Served' });
    await fcfsOption.waitFor({ state: 'visible' });
    await fcfsOption.click();
    await this.page.waitForTimeout(1000);

    // Preenche a data de início da coleta (Pickup Start Date)
    // Fills the pickup start date
    const pickupStartDate = this.page.locator('input[formcontrolname="startDate"]').first();

    await pickupStartDate.waitFor({ state: 'visible', timeout: 15000 });
    await pickupStartDate.fill(todayDate);
        await this.page.waitForTimeout(1000);
    await pickupStartDate.press('Escape'); // Fecha o calendário se abrir / Closes the calendar if open


    // Preenche a hora de início da coleta (Pickup Start Time)
    // Fills the pickup start time
    const pickupStartTime = this.page.locator(
      'input[data-placeholder="Pickup Start Time"]'
    );

    await pickupStartTime.waitFor({ state: 'visible', timeout: 15000 });
    await pickupStartTime.fill('06:00');
        await this.page.waitForTimeout(1000);
    await pickupStartTime.press('Escape');


    // Preenche a data de término da coleta (Pickup End Date)
    // Fills the pickup end date
    const pickupEndDate = this.page.locator('input[formcontrolname="endDate"]').first();

    await pickupEndDate.waitFor({ state: 'visible', timeout: 15000 });
    await pickupEndDate.fill(futureDate);
        await this.page.waitForTimeout(1000);
    await pickupEndDate.press('Escape');


    // Preenche a hora de término da coleta (Pickup End Time)
    // Fills the pickup end time
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
    // Fills the dropoff location name
    await this.page.locator('//*[contains(@class, "dropoff")]//*[text()="Location Name (search by name or ID)"]/../../preceding-sibling::input').fill('New York');
    await this.page.waitForTimeout(2000); // Aguarda a busca / Waits for search

    // Seleciona a segunda opção disponível no dropdown
    // Selects the second available option in the dropdown
    const targetOption = this.page.locator('.cdk-overlay-pane mat-option').nth(1);
    await targetOption.waitFor({ state: 'visible', timeout: 15000 });
    await targetOption.click();


    // Seleciona o tipo de agendamento para entrega
    // Selects the appointment type for dropoff
    await this.page.locator('//*[contains(@class, "dropoff")]//*[@placeholder="Appointment Type"]').click();

    const panel = this.page.locator('[role="listbox"].mat-select-panel');
    await panel.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('option', { name: 'First Come First Served' }).click();
    await this.page.waitForTimeout(1000);

    // Define data de entrega (Dropoff 1)
    // Sets dropoff date (Dropoff 1)
    const dropoffDate = this.getFormattedDate(2);
    const dropoff1Card = this.page.locator('mat-card-content', { hasText: 'Dropoff 1' }); 
    const dropoffStartDate = dropoff1Card.getByLabel('Start Date'); 
    
    await dropoffStartDate.waitFor({ state: 'visible', timeout: 15000 }); 
    await dropoffStartDate.fill(dropoffDate); 
    await this.page.waitForTimeout(1000);
    await dropoffStartDate.press('Escape');


    // Preenche a hora de início da entrega
    // Fills the dropoff start time
    const dropoffStartTime = this.page.locator(
      'input[data-placeholder="Dropoff Start Time"]'
    );

    
    await dropoffStartTime.waitFor({ state: 'visible', timeout: 15000 });
    await dropoffStartTime.fill('06:00');
        await this.page.waitForTimeout(1000);
    await dropoffStartTime.press('Escape');


    // Preenche a data de término da entrega
    // Fills the dropoff end date
    const dropoffEndDate = this.page.locator('input[formcontrolname="endDate"]').nth(1);

    await dropoffEndDate.waitFor({ state: 'visible', timeout: 15000 });
    await dropoffEndDate.fill(futureDate);
        await this.page.waitForTimeout(1000);
    await dropoffEndDate.press('Escape');


    // Preenche a hora de término da entrega
    // Fills the dropoff end time
    const dropoffEndTime = this.page.locator(
      'input[data-placeholder="Dropoff End Time"]'
    );

    await dropoffEndTime.waitFor({ state: 'visible', timeout: 15000 });
    await dropoffEndTime.fill('23:00');
        await this.page.waitForTimeout(1000);
    await dropoffEndTime.press('Escape');

  }


  async fillLoadDetails() {
    // Preenche o peso total da carga
    // Fills the total load weight
    await this.page
      .getByRole('textbox', { name: 'Total Load Weight (lbs)' })
      .click();

    await this.page
      .getByRole('textbox', { name: 'Total Load Weight (lbs)' })
      .fill('9000');

    // Seleciona o código da mercadoria (Commodity Code)
    // Selects the commodity code
    await this.page
      .locator('div')
      .filter({ hasText: /^Commodity Code \*$/ })
      .nth(2)
      .click();

    await this.page.getByText('METALS - METALS').click();

    // Seleciona o tipo de equipamento (Equipment Type)
    // Selects the equipment type
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
    // Clicks the Submit button to create the shipment
    const submitButton = this.page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible', timeout: 15000 });
    // Força o clique caso haja algum snackbar/toast cobrindo o botão
    // Forces the click in case there is a snackbar/toast covering the button
    await submitButton.click({ force: true });
    
    // DEBUG: Captura mensagem de erro se aparecer
    // DEBUG: Captures error message if it appears
    try {
      const snackbar = this.page.locator('snack-bar-container');
      if (await snackbar.isVisible({ timeout: 5000 })) {
        console.log('🚨 MENSAGEM DE ERRO DETECTADA / ERROR MESSAGE DETECTED:', await snackbar.innerText());
      }
    } catch (e) {
      console.log('Nenhum erro visível capturado / No visible error captured.');
    }

    await this.page.waitForTimeout(1000);

    // Aguarda o cabeçalho de opções de tender aparecer
    // Waits for the tender options header to appear
    await expect(this.page.getByRole('heading', { name: 'Carrier Tender Options FTL' })).toBeVisible();
    
    // Busca e seleciona a transportadora (Carrier)
    // Searches and selects the carrier
    await this.page.locator('div').filter({ hasText: /^Search Carrier \*$/ }).nth(3).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('combobox', { name: 'Search Carrier' }).fill('samba');
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: 'Samba Testes   - DOT# 951' }).click();
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000);
    
    // Seleciona o Operador (Operator) - Tentativa 1
    // Selects the Operator - Attempt 1
    const operator1 = this.page.getByRole('combobox', { name: 'Operator' });
    await operator1.click();
    await operator1.clear();
    await operator1.type('Wesley', { delay: 100 });
    await operator1.press('Backspace'); // dispara o autocomplete removendo a última letra / triggers autocomplete by removing last letter
    await this.page.waitForTimeout(1000); // Aguarda resultados do autocomplete / Waits for autocomplete results
    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);

    // Seleciona o Operador (Operator) - Tentativa 2 (Redundância para garantir seleção)
    // Selects the Operator - Attempt 2 (Redundancy to ensure selection)
    const operator2 = this.page.getByRole('combobox', { name: 'Operator' });
    await operator2.click();
    await operator2.clear();
    await operator2.type('Wesley', { delay: 100 });
    await operator2.press('Backspace'); 
    await this.page.waitForTimeout(1000); 
    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);
    
    // Preenche o preço da transportadora (Carrier Price)
    // Fills the carrier price
    const priceInput = this.page.getByRole('textbox', { name: 'Enter Carrier Price' });
    await priceInput.click();
    await priceInput.fill('9,0000.');
    await priceInput.blur();
    
    await this.page.waitForTimeout(1000); // Aguarda UI estabilizar / Waits for UI to stabilize
    
    // Seleciona o Gerente de Frota (Fleet Manager)
    // Selects the Fleet Manager
    const fleetManagerSelect = this.page.getByText('Select Fleet ManagerSelect');
    await fleetManagerSelect.waitFor({ state: 'visible', timeout: 30000 });
    await fleetManagerSelect.click();
    await this.page.waitForTimeout(1000);
    
    const fleetManagerOption = this.page.getByText('Wesley leocadio', { exact: true });
    await fleetManagerOption.waitFor({ state: 'visible' });
    await fleetManagerOption.click();
    await this.page.waitForTimeout(1000);

    // Clica no botão Tender para finalizar
    // Clicks the Tender button to finish
    await this.page.getByRole('button', { name: 'Tender' }).click();
    await this.page.waitForTimeout(1000);
  }

  async findAndOpenShipment(shipmentId: string) {
    // Localiza a tabela de Shipments
    // Locates the Shipments table
    const shipmentsTable = this.page.locator('//*[@id="shipments"]/div/div[3]/div/div[1]/mat-table');
    
    // Aguarda um pouco para garantir que a grid carregou/atualizou
    // Waits a bit to ensure the grid has loaded/updated
    await this.page.waitForTimeout(3000);

    // Encontra a linha específica pelo ID da carga
    // Finds the specific row by shipment ID
    const shipmentRow = shipmentsTable.locator('mat-row').filter({ hasText: shipmentId });

    // Valida que a linha existe e tem o status "POD Received" antes de clicar
    // Isso garante que o Broker já recebeu o status atualizado do Carrier
    // Validates that the row exists and has "POD Received" status before clicking
    // This ensures the Broker has already received the updated status from the Carrier
    await expect(shipmentRow).toBeVisible({ timeout: 20000 });
    await expect(shipmentRow).toContainText('POD Received', { timeout: 20000 });

    // Clica no link da carga usando o ID dinâmico
    // Clicks the shipment link using dynamic ID
    await shipmentRow.getByRole('link', { name: shipmentId }).click();
    
    // Valida que a página de detalhes da carga abriu
    // Validates that the shipment details page has opened
    await expect(this.page.getByText(`Load: ${shipmentId} file_copy`)).toBeVisible();
  }

  async approvePod() {
      // Navega para a aba Docs & Images
      // Navigates to Docs & Images tab
      await this.page.getByRole('link', { name: 'Docs & Images' }).click();

      // Inicia o fluxo de aprovação
      // Starts the approval flow
      await expect(this.page.getByText('Requires Approval')).toBeVisible();
      await this.page.getByText('Requires Approval').click();
      
      await expect(this.page.getByText('Signed Proof Of Delivery')).toBeVisible();
      await this.page.getByRole('button', { name: 'Approve' }).click();
      
      // Confirmação no modal
      // Confirmation modal
      await expect(this.page.getByText('Are you sure you want to')).toBeVisible();
      await this.page.getByRole('button', { name: 'Confirm' }).click();
      
      // Verifica mensagem de sucesso
      // Verifies success message
      await expect(this.page.getByRole('heading', { name: 'POD Approved' })).toBeVisible();
      
      // Lida com o fluxo de Review do Carrier (se aparecer)
      // Nota: O teste original assume que SEMPRE aparece. Se for condicional, precisaríamos de um try/catch ou verificação de visibilidade.
      // Vou manter como no original, esperando que apareça.
      // Handles Carrier Review flow (if it appears)
      // Note: Original test assumes it ALWAYS appears. If conditional, we'd need try/catch or visibility check.
      // Keeping as original, expecting it to appear.
      await expect(this.page.getByText('Would you like to update the')).toBeVisible();
      await this.page.getByRole('button', { name: 'Yes' }).click();
      await expect(this.page.getByRole('heading', { name: 'Review Samba Testes' })).toBeVisible();
      await this.page.getByRole('img', { name: 'Review icon' }).first().click(); // 5 estrelas ou similar / 5 stars or similar
      await this.page.getByRole('textbox', { name: 'Your review' }).click();
      await this.page.getByRole('textbox', { name: 'Your review' }).fill('Good service');
      await this.page.getByRole('button', { name: 'Save' }).click();
  }

 
}
