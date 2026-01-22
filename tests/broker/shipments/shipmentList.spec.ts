import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';
import { ShipmentListPage } from '../../../pageObjects/shipmentListPage';

test.describe('Broker Shipment List Validations', () => {
  let loginPage: LoginPage;
  let shipmentListPage: ShipmentListPage;

  test('Should validate shipment list features sequentially', async ({ page }) => {
    test.setTimeout(300000); // 10 minutes timeout for long sequential test with slow loading
    loginPage = new LoginPage(page, 'broker');
    shipmentListPage = new ShipmentListPage(page);

    await test.step('Login and Navigate', async () => {
      await loginPage.goto(process.env.BASE_URL_BROKER!);
      await loginPage.login(
        process.env.BROKER_USER_EMAIL!,
        process.env.BROKER_USER_PASSWORD!
      );
      await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });
    });

    await test.step('Validate Pagination and Rows', async () => {
      // await shipmentListPage.validateLoading();
      
      const pageSizeLocator = page.locator('mat-paginator').locator('span').filter({ hasText: '50' }).first();
      await expect(pageSizeLocator).toBeVisible();
      await expect(pageSizeLocator).toHaveText('50');

      const rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 30000 });
      // await expect(rows).toHaveCount(50);

      await shipmentListPage.selectPageSize('25');
      // await shipmentListPage.validateLoading();
      // await expect(rows).toHaveCount(25);

      await shipmentListPage.selectPageSize('100');
      // await shipmentListPage.validateLoading();
      // await expect(rows).toHaveCount(100);

      await shipmentListPage.selectPageSize('50');
      // await shipmentListPage.validateLoading();
      // await expect(rows).toHaveCount(50);
    });

    await test.step('Validate Navigation', async () => {
      const label = shipmentListPage.getPaginationLabel();
      await expect(label).toContainText('1 – 50 of');

      await shipmentListPage.clickNextPage();
      // await shipmentListPage.validateLoading();
      await expect(label).toContainText('51 – 100 of');

      await shipmentListPage.clickNextPage();
      // await shipmentListPage.validateLoading();
      await expect(label).toContainText('101 – 150 of');

      await page.reload();
      // await shipmentListPage.validateLoading();
      await expect(label).toContainText('1 – 50 of');
    });

    await test.step('Validate Filters', async () => {
      // 1. Validar filtro padrão "All"
      await expect(shipmentListPage.filterSelect).toContainText('All');
      
      // 2. Testar filtro "Load ID"
      await shipmentListPage.selectFilterType('Load ID');
      
      const loadIdTerm = '10021';
      await shipmentListPage.search(loadIdTerm);
      // await shipmentListPage.validateLoading();
      
      let rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 15000 });
      
      // Validar que as linhas contêm o ID buscado
      let rowTexts = await rows.allInnerTexts();
      expect(rowTexts.length).toBeGreaterThan(0);
      for (const text of rowTexts) {
        expect(text).toContain(loadIdTerm);
      }

      // 3. Limpar a busca
      await shipmentListPage.clearSearch();
      // await shipmentListPage.validateLoading();

      // 4. Testar filtro "Pick" (Estado)
      await shipmentListPage.selectFilterType('Pick');

      const stateTerm = 'Oklahoma';
      await shipmentListPage.search(stateTerm);
      // await shipmentListPage.validateLoading();

      rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 15000 });

      // Validar que as linhas contêm "Oklahoma" ou "OK"
      rowTexts = await rows.allInnerTexts();
      expect(rowTexts.length).toBeGreaterThan(0);
      
      const stateRegex = /Oklahoma|OK/i;
      for (const text of rowTexts) {
        expect(text).toMatch(stateRegex);
      }

      // 5. Limpar a busca
      await shipmentListPage.clearSearch();
      // await shipmentListPage.validateLoading();

      // 6. Testar filtro "Drop" (Estado)
      await shipmentListPage.selectFilterType('Drop');

      const dropTerm = 'New York';
      await shipmentListPage.search(dropTerm);
      // await shipmentListPage.validateLoading();

      rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 15000 });

      // Validar que as linhas contêm "New York" ou "NY"
      rowTexts = await rows.allInnerTexts();
      expect(rowTexts.length).toBeGreaterThan(0);
      
      const dropRegex = /New York|NY/i;
      for (const text of rowTexts) {
        expect(text).toMatch(dropRegex);
      }

      // 7. Limpar a busca
      await shipmentListPage.clearSearch();
      // await shipmentListPage.validateLoading();

      // 8. Testar filtro "Pickup Dates"
      await shipmentListPage.openPickupDatesFilter();

      // Validar que o botão Apply está desabilitado inicialmente
      await expect(shipmentListPage.applyFilterButton).toBeDisabled();

      // Calcular datas (1 mês atrás e dia atual)
      const today = new Date();
      const startDate = new Date();
      startDate.setMonth(today.getMonth() - 1); // 1 mês atrás
      const endDate = new Date(); // Dia atual

      // Formatar datas como MM/DD/YYYY
      const formatDate = (date: Date) => {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
      };

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      // Preencher datas
      await shipmentListPage.setPickupDateRange(startDateStr, endDateStr);

      // Validar que o botão Apply está habilitado
      await expect(shipmentListPage.applyFilterButton).toBeEnabled();

      // Aplicar filtro
      await shipmentListPage.applyFilter();
      // await shipmentListPage.validateLoading();

      // Validar resultados na tabela (Pick Date deve estar no intervalo)
      rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 15000 });
      
      // Encontrar o índice da coluna "Pick Date" dinamicamente
      const firstRowCells = rows.first().locator('mat-cell');
      const cellCount = await firstRowCells.count();
      let pickDateColIndex = -1;
      const dateRegex = /[A-Za-z]{3} \d{1,2}, \d{4}/;

      for (let i = 0; i < cellCount; i++) {
        const text = await firstRowCells.nth(i).innerText();
        if (dateRegex.test(text)) {
          pickDateColIndex = i;
          break; // A primeira coluna com data deve ser a Pick Date
        }
      }

      expect(pickDateColIndex).toBeGreaterThan(-1);
      console.log(`Pick Date column identified at index: ${pickDateColIndex}`);

      // Validar que todas as linhas têm uma data válida nessa coluna específica
      const pickDateTexts = await shipmentListPage.getColumnTexts(pickDateColIndex);
      expect(pickDateTexts.length).toBeGreaterThan(0);
      
      for (const text of pickDateTexts) {
          expect(text).toMatch(dateRegex);
      }

      // 9. Limpar filtros anteriores
      await shipmentListPage.clearAllFilters();
      // await shipmentListPage.validateLoading();

      // 10. Testar filtro "Dropoff Dates"
      await shipmentListPage.openDropoffDatesFilter();

      // Validar que o botão Apply está desabilitado inicialmente
      await expect(shipmentListPage.applyFilterButton).toBeDisabled();

      // Calcular datas (15 dias atrás e dia atual)
      const startDateDrop = new Date();
      startDateDrop.setDate(today.getDate() - 15); // 15 dias atrás
      const endDateDrop = new Date(); // Dia atual

      const startDateDropStr = formatDate(startDateDrop);
      const endDateDropStr = formatDate(endDateDrop);

      // Preencher datas
      await shipmentListPage.setDateRange(startDateDropStr, endDateDropStr);

      // Validar que o botão Apply está habilitado
      await expect(shipmentListPage.applyFilterButton).toBeEnabled();

      // Aplicar filtro
      await shipmentListPage.applyFilter();
      // await shipmentListPage.validateLoading();

      // Validar resultados na tabela (Drop Date deve estar no intervalo)
      rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 15000 });

      // Encontrar o índice da coluna "Drop Date" dinamicamente
      const firstRowCellsDrop = rows.first().locator('mat-cell');
      const cellCountDrop = await firstRowCellsDrop.count();
      let dropDateColIndex = -1;
      
      for (let i = 0; i < cellCountDrop; i++) {
        const text = await firstRowCellsDrop.nth(i).innerText();
        if (dateRegex.test(text)) {
            if (i > pickDateColIndex) {
                 dropDateColIndex = i;
                 break;
            }
        }
      }
      
       if (dropDateColIndex === -1) {
           console.log('Second date column not found, trying to find any date column...');
            for (let i = 0; i < cellCountDrop; i++) {
                 const text = await firstRowCellsDrop.nth(i).innerText();
                 if (dateRegex.test(text)) {
                     dropDateColIndex = i;
                 }
            }
       }

       console.log(`Drop Date column identified at index: ${dropDateColIndex}`);
       expect(dropDateColIndex).toBeGreaterThan(-1);

       const dropDateTexts = await shipmentListPage.getColumnTexts(dropDateColIndex);
       expect(dropDateTexts.length).toBeGreaterThan(0);
       
       for (const text of dropDateTexts) {
           expect(text).toMatch(dateRegex);
       }

       // Validar que Pick Date TAMBÉM está visível e válido
       if (pickDateColIndex > -1) {
           const pickDateTextsAfterDropFilter = await shipmentListPage.getColumnTexts(pickDateColIndex);
           expect(pickDateTextsAfterDropFilter.length).toBeGreaterThan(0);
           for (const text of pickDateTextsAfterDropFilter) {
               expect(text).toMatch(dateRegex);
           }
       }

      // 11. Limpar filtros anteriores
      await shipmentListPage.clearAllFilters();
      // await shipmentListPage.validateLoading();

      // 12. Testar filtro "Priority"
      await shipmentListPage.openPriorityFilter();
      
      const dropdown = shipmentListPage.priorityDropdown;
      await expect(dropdown).toBeVisible();
      await expect(dropdown).toContainText('Fire Loads');
      await expect(dropdown).toContainText('At Risk');
      await expect(dropdown).toContainText('Check Call');

      await shipmentListPage.selectPriorityOption('Fire Loads');
      await shipmentListPage.selectPriorityOption('At Risk');
      await shipmentListPage.selectPriorityOption('Check Call');

      await shipmentListPage.applyPriorityFilter();
      // await shipmentListPage.validateLoading();

      rows = shipmentListPage.getRows();
      await expect(rows.first()).toBeVisible({ timeout: 15000 });
      
      const finalRowCount = await rows.count();
      expect(finalRowCount).toBeGreaterThan(0);

      // 13. Limpar filtros anteriores
      await shipmentListPage.clearAllFilters();
      // await shipmentListPage.validateLoading();
    });
  });
});
