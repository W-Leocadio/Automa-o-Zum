import { Page, Locator, expect } from '@playwright/test';

export class ShipmentListPage {
  readonly page: Page;
  readonly loadingText: Locator;
  readonly pageSizeSelect: Locator;
  readonly paginationSelect: Locator;
  readonly paginationLabel: Locator;
  readonly nextPageButton: Locator;
  readonly tableRows: Locator;
  readonly filterSelect: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly pickupDatesFilterButton: Locator;
  readonly dropoffDatesFilterButton: Locator;
  readonly clearAllButton: Locator;
  readonly priorityFilterButton: Locator;
  readonly priorityDropdown: Locator;
  readonly priorityApplyButton: Locator;
  readonly shipmentStatusFilterButton: Locator;
  readonly shipmentStatusDropdown: Locator;
  readonly shipmentStatusSearchInput: Locator;
  readonly dateRangeStartInput: Locator;
  readonly dateRangeEndInput: Locator;
  readonly applyFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locator para o texto de loading
    // Locator for loading text
    this.loadingText = page.getByText('Loading Shipments.', { exact: false });
    
    // Locator para o seletor de tamanho da página (validando o valor 50)
    // Locator for page size selector (validating value 50)
    // Usando a sugestão do usuário, mas refinando para garantir que pegamos o valor selecionado no mat-select
    this.pageSizeSelect = page.locator('mat-select[aria-label="Items per page:"] span.mat-select-value-text span').first().or(
        page.locator('span').filter({ hasText: '50' }).first()
    );

    // Locator para o dropdown de paginação (clique para abrir opções)
    // Locator for pagination dropdown (click to open options)
    this.paginationSelect = page.locator('mat-paginator mat-select');

    // Locator para o label de intervalo da paginação (ex: 1 – 50 of 4751)
    // Locator for pagination range label
    this.paginationLabel = page.locator('.mat-paginator-range-label');

    // Locator para o botão de próxima página
    // Locator for next page button
    this.nextPageButton = page.locator('button.mat-paginator-navigation-next');

    // Locator para as linhas da tabela
    // Locator for table rows
    this.tableRows = page.locator('#shipments mat-table mat-row');

    // Locator para o select de filtro (ex: All, Load ID)
    // Locator for filter select
    this.filterSelect = page.locator('mat-select[formcontrolname="searchAppliedTo"]');

    // Locator para o campo de busca
    // Locator for search input
    this.searchInput = page.locator('input[formcontrolname="searchText"]');

    // Locator para o botão de limpar busca
    // Locator for clear search button
    this.clearSearchButton = page.locator('button[aria-label="Clear"]');

    // Locator para o botão de filtro de datas de coleta (Pickup Dates)
    // Locator for Pickup Dates filter button
    this.pickupDatesFilterButton = page.locator('span.align-center').filter({ hasText: 'Pickup Dates' });

    // Locator para o botão de filtro de datas de entrega (Dropoff Dates)
    // Locator for Dropoff Dates filter button
    this.dropoffDatesFilterButton = page.locator('span.align-center').filter({ hasText: 'Dropoff Dates' });

    // Locator para o botão Clear all
    // Locator for Clear all button
    this.clearAllButton = page.locator('.clear-all');

    // Locator para o botão de filtro de prioridade (Priority)
    // Locator for Priority filter button
    this.priorityFilterButton = page.locator('.shipments-filter-menu').filter({ hasText: 'Priority' });

    // Locator para o dropdown de prioridade
    // Locator for priority dropdown
    this.priorityDropdown = page.locator('.dropdown-list.small-dropdown');

    // Locator para o botão Apply do filtro de prioridade
    // Locator for Priority filter Apply button
    this.priorityApplyButton = page.locator('.apply-selection');

    // Locator para o botão de filtro de status do embarque (Shipment Status)
    // Locator for Shipment Status filter button
    // Usuário solicitou clicar no ícone expand_more dentro da div
    this.shipmentStatusFilterButton = page.locator('.shipments-filter-menu')
        .filter({ hasText: 'Shipment Status' })
        .locator('mat-icon')
        .filter({ hasText: 'expand_more' });

    // Locator para o dropdown de Shipment Status
    // Locator for Shipment Status dropdown
    // Usando o mesmo locator genérico se for o mesmo dropdown
    this.shipmentStatusDropdown = page.locator('.dropdown-list.small-dropdown');

    // Locator para o campo de busca dentro do dropdown de Shipment Status
    // Locator for search input inside Shipment Status dropdown
    this.shipmentStatusSearchInput = this.shipmentStatusDropdown.locator('input[placeholder="Search"]');

    // Locators para os inputs de data no modal (Start e End)
    // Locators for date inputs in modal (Start and End)
    // Assumindo que aparecem em ordem no DOM quando o modal abre
    this.dateRangeStartInput = page.locator('input[placeholder="MM/DD/YYYY"]').first();
    this.dateRangeEndInput = page.locator('input[placeholder="MM/DD/YYYY"]').nth(1);

    // Locator para o botão Apply
    // Locator for Apply button
    this.applyFilterButton = page.getByText('Apply');
  }

  // Valida o comportamento do loading (aparecer e sumir) com lógica de retry/reload
  // Validates loading behavior (appear and disappear) with retry/reload logic
  async validateLoading() {
    // Tenta esperar o loading aparecer.
    // Try to wait for loading to appear.
    try {
        await this.loadingText.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.loadingText).toBeVisible();
    } catch (e) {
        // Ignora se não aparecer (pode ter sido muito rápido)
        // Ignore if it doesn't appear (might have been too fast)
        // console.log('Loading text might have been too fast or did not appear.');
    }
    
    // Tenta esperar sumir. Se falhar, faz reload.
    // Try to wait for it to disappear. If it fails, reload.
    try {
        await expect(this.loadingText).toBeHidden({ timeout: 5000 });
    } catch (e) {
        console.log('Loading text stuck. Reloading page...');
        await this.page.reload();
        
        // Espera novamente o loading sumir após o reload
        // Wait for loading to disappear again after reload
        try {
            await this.loadingText.waitFor({ state: 'visible', timeout: 5000 });
        } catch (retryError) {
             // Pode não aparecer no reload
        }
        await expect(this.loadingText).toBeHidden({ timeout: 60000 });
    }
  }

  // Seleciona um tamanho de página
  // Selects a page size
  async selectPageSize(size: string) {
    await this.paginationSelect.click();
    await this.page.locator('mat-option').filter({ hasText: size }).first().click();
  }

  // Clica no botão de próxima página
  // Clicks next page button
  async clickNextPage() {
    await this.nextPageButton.click();
  }

  // Retorna o locator do label da paginação
  // Returns pagination label locator
  getPaginationLabel() {
    return this.paginationLabel;
  }

  // Retorna o locator das linhas para asserções de contagem
  // Returns rows locator for count assertions
  getRows() {
    return this.tableRows;
  }

  // Seleciona o tipo de filtro (ex: Load ID)
  // Selects filter type
  async selectFilterType(type: string) {
    await this.filterSelect.click();
    await this.page.locator('mat-option').filter({ hasText: type }).first().click();
  }

  // Digita no campo de busca
  // Types in search input
  async search(text: string) {
    await this.searchInput.fill(text);
    // Às vezes precisa dar Enter ou esperar debounce
    // Sometimes needs Enter or wait for debounce
    // await this.searchInput.press('Enter'); 
  }

  // Limpa o campo de busca
  // Clears search input
  async clearSearch() {
    await this.clearSearchButton.click();
  }

  // Abre o filtro de Pickup Dates
  // Opens Pickup Dates filter
  async openPickupDatesFilter() {
    await this.pickupDatesFilterButton.click();
  }

  // Abre o filtro de Dropoff Dates
  // Opens Dropoff Dates filter
  async openDropoffDatesFilter() {
    await this.dropoffDatesFilterButton.click();
  }

  // Limpa todos os filtros
  // Clears all filters
  async clearAllFilters() {
    // Verifica se o botão está visível antes de clicar
    if (await this.clearAllButton.isVisible()) {
        await this.clearAllButton.click();
    }
  }

  // Define o intervalo de datas (genérico para Pickup e Dropoff)
  // Sets date range (generic for Pickup and Dropoff)
  async setDateRange(startDate: string, endDate: string) {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
  }

  // Mantido para compatibilidade, mas redireciona para setDateRange
  // Kept for compatibility, but redirects to setDateRange
  async setPickupDateRange(startDate: string, endDate: string) {
    await this.setDateRange(startDate, endDate);
  }

  // Clica no botão Apply
  // Clicks Apply button
  async applyFilter() {
    await this.applyFilterButton.click();
  }

  async openPriorityFilter() {
    await this.priorityFilterButton.click();
  }

  async selectPriorityOption(optionText: string) {
    // Encontrar o container que tem o texto e então o checkbox dentro ou próximo
    await this.priorityDropdown.locator('div.mb-12, div.mb-4')
        .filter({ hasText: optionText })
        .locator('mat-checkbox')
        .click();
  }

  async applyPriorityFilter() {
    await this.priorityApplyButton.click();
  }

  async openShipmentStatusFilter() {
    // Forçar clique se necessário ou garantir visibilidade
    await this.shipmentStatusFilterButton.waitFor({ state: 'visible' });
    await this.shipmentStatusFilterButton.click();
    
    // Pequena pausa para animação do dropdown
    await this.page.waitForTimeout(500);

    // Garantir que o dropdown está visível antes de prosseguir
    // Ensure dropdown is visible before proceeding
    // Usar um locator mais genérico primeiro para debug/estabilidade
    await this.page.locator('.dropdown-list.small-dropdown').first().waitFor({ state: 'visible' });
  }

  async searchAndSelectShipmentStatus(statusText: string) {
    // Usando getByPlaceholder conforme snippet do usuário para garantir que encontra o input correto
    // Using getByPlaceholder as per user snippet to ensure correct input is found
    const searchInput = this.page.locator('.dropdown-list').getByPlaceholder('Search');
    
    // Usuário solicitou digitação lenta para simular comportamento humano
    // User requested slow typing to simulate human behavior
    await searchInput.pressSequentially(statusText, { delay: 100 });
    
    // Esperar um pouco para a lista filtrar
    // Wait a bit for list to filter
    await this.page.waitForTimeout(1000); 

    // Clicar no checkbox correspondente dentro da lista visível
    // Click on corresponding checkbox inside visible list
    await this.page.locator('.dropdown-list mat-checkbox').first().click();
  }

  async applyShipmentStatusFilter() {
    // Reutilizando o botão Apply genérico (priorityApplyButton é .apply-selection)
    // Reusing generic Apply button (priorityApplyButton is .apply-selection)
    await this.priorityApplyButton.click();
  }

  // Obtém o texto de todas as linhas
  // Gets text of all rows
  async getRowsText() {
    return this.tableRows.allInnerTexts();
  }

  // Obtém os IDs da tabela (assumindo primeira coluna ou coluna específica de ID)
  // Gets table IDs (assuming first column or specific ID column)
  async getColumnTexts(columnIndex: number = 0) {
    // mat-cell:nth-child(index + 1) porque CSS é 1-based
    return this.tableRows.locator(`mat-cell:nth-child(${columnIndex + 1})`).allInnerTexts();
  }
}
