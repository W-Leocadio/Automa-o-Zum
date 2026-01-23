import { Page, Locator, expect } from '@playwright/test';

export class LocationPage {
  readonly page: Page;
  readonly locationsMenuLink: Locator;
  readonly addLocationButton: Locator;
  readonly locationNameInput: Locator;
  readonly locationCodeSelect: Locator;
  readonly locationCodeInput: Locator;
  readonly addressInput: Locator;
  readonly suiteInput: Locator;
  readonly sharedNotesInput: Locator;
  readonly createButton: Locator;
  readonly saveChangesButton: Locator;
  readonly confirmUpdateButton: Locator;
  
  // Lista de códigos de localização disponíveis
  // List of available location codes
  readonly locationCodes = [
    'ATS - associated traffic',
    'BLU - Blue Grace',
    'BRO - BROUSSARD',
    'CAT - Capital Transportation Logis',
    'GLI - GLI',
    'MCS - MCSOURCE TECH',
    'MEG - MEGA LOGISTICS',
    'PHL - Lead Qual Philipines Support',
    'PLT - PLANT',
    'SIM - Simplified Logistics',
    'TAN - TANK WASH',
    'TER - TERMINAL',
    'TRA - transanalysis',
    'TVA - Transvantage',
    'WH - WAREHOUSE',
    'ACC - Auto Credit Card',
    'CAP - Capital Transportation Solut',
    'DMT - DM TRANSPORT',
    'ENV - ENVISTA',
    'HAZ - HAZMAT',
    'ITN - INTUNE LOGISTICS',
    'TFM - Target Freight Manegment',
    'VER - veraction',
    'AR - AR TRAFFIC',
    'CLR - clearview audit',
    'CPA - CPA PAY AGENT',
    'CRS - Cross Dock',
    'FAC - F.A.C.T.S. - pay agent',
    'FRT - FREIGHT EDGE',
    'IL2 - IL2000',
    'ITT - ITT TDS',
    'NTC - National traffic consultants',
    'RE - RE TRANS',
    'REP - REPAIR SHOPS',
    'TSF - TEMP SALES FOCUS (Q2 COMP)',
    'ZA - FCC- CAM ZIP ACCOUNTS',
    'CDT - conduent',
    'CQL - Capacity Qte Not Listed BOL',
    'CTG - CT GLOBAL FREIGHT',
    'DDI - DDI PAY AGENT',
    'FDX - FedEx Charitable',
    'INT - INTELLIGENT AUDIT',
    'NTR - National Traffic Services',
    'TFS - TRAFFIC SYSTEMS',
    'TT - Tech Transport'
  ];

  constructor(page: Page) {
    this.page = page;
    // Seletor para o link "Locations" no menu lateral
    // Selector for "Locations" link in side menu
    this.locationsMenuLink = page.getByRole('link', { name: 'Locations' });
    
    // Seletor para o botão "Add Location"
    // Selector for "Add Location" button
    this.addLocationButton = page.getByRole('button', { name: 'Add Location' });
    
    // Seletor para o input de Nome da Localização
    // Selector for Location Name input
    this.locationNameInput = page.getByLabel('Location Name');
    
    // Seletor para o dropdown de código de localização
    // Selector for location code dropdown
    // Usando uma estratégia mais robusta baseada na estrutura do Angular Material
    // Using a more robust strategy based on Angular Material structure
    this.locationCodeSelect = page.locator('mat-form-field').filter({ hasText: 'Location Code' }).locator('mat-select');
    
    // Fallback: se não encontrar pelo label "Location Code", tentar apenas "Code" ou usar filtro
    // Fallback: if not found by label "Location Code", try just "Code" or use filter
    // this.locationCodeSelect = page.locator('mat-select').first(); // Temporário se o label falhar
    // Search input inside dropdown (appears after clicking select)
    this.locationCodeInput = page.getByPlaceholder('Search...');
    
    // Input de endereço
    // Address input
    this.addressInput = page.locator('input[formcontrolname="fullAddress"]');

    // Input de Suite #
    // Suite # input
    this.suiteInput = page.locator('input[formcontrolname="address2"]');
    
    // Input de Shared Notes
    // Shared Notes input
    this.sharedNotesInput = page.locator('textarea[formcontrolname="sharedNotes"]');

    // Botão Create
    // Create button
    this.createButton = page.getByRole('button', { name: 'Create' });

    // Seletor para o botão "Save Changes" (baseado no HTML fornecido)
    // Selector for "Save Changes" button (based on provided HTML)
    this.saveChangesButton = page.locator('button[mat-raised-button][color="accent"]').filter({ hasText: 'Save Changes' });

    // Botão de confirmação de update (Modal)
    // Update confirmation button (Modal)
    this.confirmUpdateButton = page.getByRole('button', { name: 'Confirm' });
  }

  // Lista de endereços reais para teste
  // List of real addresses for testing
  readonly realAddresses = [
    '350 Fifth Avenue, New York, NY 10118',
    '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    '1 Microsoft Way, Redmond, WA 98052',
    '111 S Michigan Ave, Chicago, IL 60603',
    '600 Montgomery St, San Francisco, CA 94111',
    '700 Exposition Park Dr, Los Angeles, CA 90037',
    '401 Biscayne Blvd, Miami, FL 33132',
    '500 S Buena Vista St, Burbank, CA 91521',
    '1 Infinite Loop, Cupertino, CA 95014',
    '4059 Mt Lee Dr, Hollywood, CA 90068',
    '700 Pennsylvania Ave NW, Washington, DC 20408',
    '1200 Getty Center Dr, Los Angeles, CA 90049',
    '1000 5th Ave, New York, NY 10028',
    '151 3rd St, San Francisco, CA 94103',
    '901 Cherry Ave, San Bruno, CA 94066',
    '2101 E Coliseum Blvd, Fort Wayne, IN 46805',
    '600 Congress Ave, Austin, TX 78701',
    '1100 Congress Ave, Austin, TX 78701',
    '4 Yawkey Way, Boston, MA 02215',
    '700 Clark Ave, St. Louis, MO 63102',
    '233 S Wacker Dr, Chicago, IL 60606',
    '600 Peachtree St NE, Atlanta, GA 30308',
    '100 Legends Way, Boston, MA 02114',
    '700 Exposition Park Dr, Los Angeles, CA 90037',
    '1000 Market St, St. Louis, MO 63101',
    '500 E Cesar Chavez St, Austin, TX 78701',
    '100 Universal City Plaza, Universal City, CA 91608',
    '600 E Grand Ave, Chicago, IL 60611',
    '151 W 34th St, New York, NY 10001',
    '800 W Olympic Blvd, Los Angeles, CA 90015'
  ];

  // Navegar para a página de Locations
  // Navigate to Locations page
  async navigateToLocations() {
    console.log('Attempting to navigate to Locations...');
    await this.locationsMenuLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.locationsMenuLink.click();
    await expect(this.page).toHaveURL(/\/main\/locations/, { timeout: 30000 });
  }

  // Clicar no botão Add Location
  // Click Add Location button
  async clickAddLocation() {
    await this.addLocationButton.click();
  }

  // Preencher nome da localização com valor aleatório
  // Fill location name with random value
  async fillLocationName(name: string) {
    await this.locationNameInput.fill(name);
  }

  // Selecionar um código de localização aleatório
  // Select a random location code
  async selectRandomLocationCode() {
    // Escolher um código aleatório da lista
    // Pick a random code from list
    const randomIndex = Math.floor(Math.random() * this.locationCodes.length);
    const selectedCode = this.locationCodes[randomIndex];
    
    console.log(`Selecting Location Code: ${selectedCode}`);
    
    // Extrair apenas a abreviação (os 3 primeiros caracteres ou antes do " - ")
    // Extract only the abbreviation (first 3 chars or before " - ")
    const abbreviation = selectedCode.split(' - ')[0];
    console.log(`Typing abbreviation: ${abbreviation}`);

    // Loop para garantir que o dropdown abra clicando no mat-select-value
    // Loop to ensure dropdown opens by clicking on mat-select-value
    const maxRetries = 3;
    let opened = false;
    
    // Alvo do clique: elemento específico dentro do select
    // Click target: specific element inside select
    const clickTarget = this.locationCodeSelect.locator('.mat-select-value');

    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Attempt ${i + 1} to open Location Code dropdown...`);
            // Garantir que o alvo está visível antes de clicar
            await clickTarget.waitFor({ state: 'visible', timeout: 5000 });
            await clickTarget.click();
            
            // Verificar se o painel abriu (cdk-overlay-pane geralmente contém as opções)
            // Verify if panel opened (cdk-overlay-pane usually contains options)
            // Espera curta para verificar sucesso
            await this.page.locator('.cdk-overlay-pane').waitFor({ state: 'visible', timeout: 2000 });
            opened = true;
            console.log('Dropdown opened successfully.');
            break;
        } catch (e) {
            console.log(`Dropdown didn't open on attempt ${i + 1}. Retrying...`);
            // Pequena pausa antes de tentar novamente
            await this.page.waitForTimeout(1000);
        }
    }

    if (!opened) {
        throw new Error(`Failed to open Location Code dropdown after ${maxRetries} attempts.`);
    }
    
    // Como é um mat-select com filtro, geralmente digitamos para filtrar
    // As it is a mat-select with filter, usually we type to filter
    // O usuário mencionou "aqui dentro digitamos", então provavelmente há um input de filtro
    // User mentioned "inside we type", so likely there is a filter input
    
    // Digitar apenas a abreviação conforme solicitado
    // Type only the abbreviation as requested
    await this.page.keyboard.type(abbreviation);
    
    // Esperar a opção aparecer e clicar nela
    // Wait for option to appear and click it
    // A opção geralmente contém o texto completo
    // The option usually contains the full text
    await this.page.getByRole('option', { name: selectedCode }).click();
    
    return selectedCode;
  }
  
  // Preencher endereço com um valor aleatório da lista e selecionar primeira opção
  // Fill address with a random value from list and select first option
  async fillRandomAddress() {
    // Escolher um endereço aleatório
    // Pick a random address
    const randomIndex = Math.floor(Math.random() * this.realAddresses.length);
    const selectedAddress = this.realAddresses[randomIndex];
    
    console.log(`Typing Address: ${selectedAddress}`);
    
    // Digitar o endereço
    // Type the address
    await this.addressInput.fill(selectedAddress);
    
    // Esperar as opções do autocomplete aparecerem
    // Wait for autocomplete options to appear
    const autocompletePanel = this.page.locator('.mat-autocomplete-panel');
    await expect(autocompletePanel).toBeVisible({ timeout: 10000 });
    
    // Clicar na primeira opção
    // Click on the first option
    console.log('Clicking first address option...');
    const firstOption = autocompletePanel.locator('mat-option').first();
    await firstOption.click();
    
    return selectedAddress;
  }
  
  // Preencher Suite # com número aleatório
  // Fill Suite # with random number
  async fillSuite(value: string) {
    await this.suiteInput.fill(value);
  }
  
  // Preencher Shared Notes
  // Fill Shared Notes
  async fillSharedNotes(value: string) {
    await this.sharedNotesInput.fill(value);
  }

  // Clicar no botão Create
  // Click Create button
  async clickCreate() {
    await this.createButton.click();
  }

  // Clicar no botão Save Changes
  // Click Save Changes button
  async clickSaveChanges() {
    await this.saveChangesButton.click();
  }

  // Confirmar atualização no modal
  // Confirm update in modal
  async confirmUpdate() {
    // Validar texto do modal
    // Validate modal text
    await expect(this.page.getByText('By updating this location all the shipments that have this stop will be updated.')).toBeVisible();
    
    // Clicar em Confirm
    // Click Confirm
    await this.confirmUpdateButton.click();
    
    // Validar toast de sucesso de atualização (texto provável baseado no padrão)
    // Validate update success toast (likely text based on pattern)
    // Ajuste conforme necessário se o texto for diferente
    await expect(this.page.getByText('Location has been updated')).toBeVisible({ timeout: 10000 });
  }

  // ========================
  // WORKING HOURS LOGIC
  // ========================

  readonly days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Helper para selecionar opção no mat-select
  private async selectMatOption(options: string[]) {
    // Esperar o overlay aparecer
    const overlay = this.page.locator('.mat-autocomplete-panel, .mat-select-panel, .cdk-overlay-pane').first();
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Tentar encontrar uma opção que contenha um dos textos fornecidos
    for (const text of options) {
      const option = this.page.locator('mat-option').filter({ hasText: text }).first();
      if (await option.count() > 0) {
        await option.click();
        return;
      }
    }
    
    // Fallback: seleciona a primeira opção se nenhuma específica for encontrada (mas tenta evitar)
    console.log('Specific time option not found, selecting first available...');
    await this.page.locator('mat-option').first().click();
  }

  async fillWorkingHoursRandomly() {
    const workingHoursContainer = this.page.locator('[formgroupname="workingHours"]');
    
    // 1. Decidir quantos dias serão ABERTOS (6 ou 7)
    const numOpenDays = Math.random() < 0.5 ? 6 : 7;
    console.log(`Open Days count: ${numOpenDays}`);
    
    // 2. Embaralhar os dias para escolher quais fechar
    const shuffledDays = [...this.days].sort(() => 0.5 - Math.random());
    const openDays = shuffledDays.slice(0, numOpenDays);
    const closedDays = shuffledDays.slice(numOpenDays);
    
    console.log(`Open Days: ${openDays.join(', ')}`);
    console.log(`Closed Days: ${closedDays.join(', ')}`);

    // 3. Iterar sobre todos os dias
    for (const day of this.days) {
      const dayContainer = workingHoursContainer.locator(`[formgroupname="${day}"]`);
      
      // Checkbox principal do dia (PRIMEIRO mat-checkbox)
      // Main day checkbox (FIRST mat-checkbox)
      const mainDayCheckbox = dayContainer.locator('mat-checkbox').first();
      const mainDayInput = mainDayCheckbox.locator('input[type="checkbox"]');
      
      // Checkbox isClosed
      const isClosedCheckbox = dayContainer.locator('mat-checkbox[formcontrolname="isClosed"]');
      const isClosedInput = isClosedCheckbox.locator('input[type="checkbox"]');
      
      const openSelect = dayContainer.locator('mat-select[formcontrolname="open"]');
      const closeSelect = dayContainer.locator('mat-select[formcontrolname="close"]');

      if (openDays.includes(day)) {
        // DIA ABERTO / OPEN DAY
        
        // 1. Clicar OBRIGATORIAMENTE no checkbox principal se não estiver marcado
        // 1. MUST click the main checkbox if not checked
        if (!(await mainDayInput.isChecked())) {
            console.log(`Enabling day: ${day}`);
            await mainDayCheckbox.click();
        }
        
        // Garantir que está MARCADO
        // Ensure it is CHECKED
        await expect(mainDayInput).toBeChecked();

        // 2. Garantir que isClosed esteja DESMARCADO
        // 2. Ensure isClosed is UNCHECKED
        if (await isClosedInput.isChecked()) {
          console.log(`Unchecking isClosed for day: ${day}`);
          await isClosedCheckbox.click();
        }

        // 3. Preencher Open e Close
        // 3. Fill Open and Close
        
        // Selecionar Open Time
        await openSelect.click();
        const morningOptions = ['08:00', '8:00', '08:30', '8:30', '09:00', '9:00', '09:30', '9:30', '10:00'];
        await this.selectMatOption(morningOptions);

        // Selecionar Close Time
        await closeSelect.click();
        const eveningOptions = ['17:00', '05:00 PM', '5:00 PM', '17:30', '05:30 PM', '5:30 PM', '18:00', '06:00 PM', '6:00 PM', '18:30', '06:30 PM', '6:30 PM', '19:00', '07:00 PM', '7:00 PM', '19:30', '07:30 PM', '7:30 PM', '20:00', '08:00 PM', '8:00 PM'];
        await this.selectMatOption(eveningOptions);
        
      } else {
        // DIA FECHADO / CLOSED DAY
        
        // 1. NÃO Clicar no checkbox principal (User update: "no dia que estiver fechado não pode clicar no aberto")
        // 1. DO NOT Click main checkbox
        
        // 2. Marcar isClosed
        // 2. Mark isClosed
        if (!(await isClosedInput.isChecked())) {
          console.log(`Checking isClosed for day: ${day}`);
          await isClosedCheckbox.click();
        }
      }
    }
  }

  // Método auxiliar para gerar nome aleatório interessante
  // Helper method to generate interesting random name
  generateRandomLocationName(): string {
    const adjectives = ['Global', 'Strategic', 'Central', 'Rapid', 'Secure', 'Dynamic', 'Prime', 'Elite', 'Advanced', 'Core'];
    const types = ['Hub', 'Center', 'Depot', 'Base', 'Station', 'Point', 'Facility', 'Terminal', 'Zone', 'Complex'];
    const suffix = Math.floor(Math.random() * 1000);
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return `${randomAdjective} ${randomType} ${suffix}`;
  }

  // Validar se a localização foi criada e aparece na tabela
  // Validate if location was created and appears in table
  async validateLocationCreated(locationName: string) {
    // Validar mensagem de sucesso (Toast)
    // Validate success message (Toast)
    // User request: "apos apertar o botão 'created' preciso que esse txt seja validado Location has been added"
    await expect(this.page.getByText('Location has been added')).toBeVisible({ timeout: 10000 });

    // Aguardar a navegação de volta para a lista (assumindo que redireciona)
    // Wait for navigation back to list (assuming it redirects)
    // O URL deve terminar com /locations ou ter parâmetros, mas não /add
    await expect(this.page).toHaveURL(/\/main\/locations/);

    // Localizar a tabela usando o XPath fornecido pelo usuário
    // Locate table using user provided XPath
    const tableContainer = this.page.locator('//*[@id="locations"]/div[2]');
    
    // Verificar se o container da tabela está visível
    // Verify table container is visible
    await expect(tableContainer).toBeVisible({ timeout: 10000 });

    // Verificar se o nome da localização está presente na tabela
    // Verify location name is present in table
    const locationRow = tableContainer.getByText(locationName);
    await expect(locationRow).toBeVisible();
    
    console.log(`Location "${locationName}" successfully validated in the list.`);
  }

  // Editar a localização (clicando no nome)
  // Edit location (clicking on the name)
  async editLocation(locationName: string) {
    console.log(`Attempting to edit location: ${locationName}`);
    const tableContainer = this.page.locator('//*[@id="locations"]/div[2]');
    
    // Clicar no nome da localização para abrir a edição
    // Click on location name to open edit
    await tableContainer.getByText(locationName).first().click();
  }

  // Excluir a localização criada
  // Delete the created location
  async deleteLocation(locationName: string) {
    console.log(`Attempting to delete location: ${locationName}`);
    
    // Estratégia baseada na estrutura do Angular Material (mat-row > mat-cell)
    // Strategy based on Angular Material structure (mat-row > mat-cell)
    
    // Encontrar a linha (pela classe mat-row, tag mat-row, role row ou tr) que contém o nome da localização
    // Find the row (by class mat-row, tag mat-row, role row or tr) that contains the location name
    const row = this.page.locator('mat-row, .mat-row, [role="row"], tr').filter({ hasText: locationName });
    
    // Verificar se a linha foi encontrada
    // Check if row was found
    if (await row.count() === 0) {
       console.log('Row not found with standard selectors. Debugging structure...');
       // Fallback para divs se não for mat-table padrão
       const tableContainer = this.page.locator('//*[@id="locations"]/div[2]');
       // Tentar encontrar qualquer container que tenha o texto e o botão delete
       // Try to find any container having the text and delete button
       // XPath: Encontre um elemento que contém o texto e tem um descendente com ícone delete
       const genericRow = tableContainer.locator(`xpath=.//*[contains(text(), "${locationName}")]/ancestor::div[.//mat-icon[text()="delete_outline"]][1]`);
       
       if (await genericRow.count() > 0) {
           console.log('Generic row found via XPath.');
           await genericRow.locator('mat-icon').filter({ hasText: 'delete_outline' }).click();
           return;
       }
       
       console.log('Could not find row. Dumping table container text for debug:');
       console.log(await tableContainer.innerText());
       throw new Error(`Could not find row for location: ${locationName}`);
    }

    // Dentro da linha, encontrar o botão de delete
    // Inside the row, find the delete button
    // O botão contém o ícone 'delete_outline'
    const deleteButton = row.locator('mat-icon').filter({ hasText: 'delete_outline' });
    
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();
    
    // Validar se o modal foi aberto
    // Validate if modal opened
    await expect(this.page.getByText('By removing this location, all corresponding location information will be lost')).toBeVisible();
    
    // Clicar em Confirm
    // Click Confirm
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }
  
  // Validar se o item foi deletado da tabela
  // Validate if item was deleted from table
  async validateLocationDeleted(locationName: string) {
    const tableContainer = this.page.locator('//*[@id="locations"]/div[2]');
    
    // Esperar que o elemento desapareça
    // Wait for element to disappear
    await expect(tableContainer.getByText(locationName)).toBeHidden({ timeout: 10000 });
    
    console.log(`Location "${locationName}" successfully deleted.`);
  }
}
