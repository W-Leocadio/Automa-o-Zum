import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';
import { LocationPage } from '../../../pageObjects/locationPage';

// Função auxiliar para validação de carregamento
// Helper function for loading validation
async function validateLoading(page: Page) {
  // Usando um seletor genérico para "Loading..."
  // Using a generic selector for "Loading..."
  const loading = page.getByText('Loading...', { exact: false });
  try {
    // Tenta esperar o loading aparecer
    // Try to wait for loading to appear
    await loading.waitFor({ state: 'visible', timeout: 5000 });
  } catch (e) {
    // Pode não aparecer se for muito rápido
    // Might not appear if too fast
  }
  
  try {
    // Espera o loading sumir
    // Wait for loading to disappear
    await expect(loading).toBeHidden({ timeout: 10000 });
  } catch (e) {
    console.log('Loading state persisted; reloading page...');
    await page.reload();
    // Após reload, espera sumir com timeout maior
    // After reload, wait to disappear with longer timeout
    await expect(loading).toBeHidden({ timeout: 30000 });
  }
}

test.describe('Broker - Locations Management', () => {
  let loginPage: LoginPage;
  let locationPage: LocationPage;

  test.beforeEach(async ({ page }) => {
    // Inicializar Page Objects
    // Initialize Page Objects
    loginPage = new LoginPage(page, 'broker');
    locationPage = new LocationPage(page);
    
    // Realizar login
    // Perform login
    console.log('Navigating to Broker URL...');
    await loginPage.goto(process.env.BASE_URL_BROKER!);
    
    console.log('Logging in...');
    await loginPage.login(
      process.env.BROKER_USER_EMAIL!,
      process.env.BROKER_USER_PASSWORD!
    );
    
    // Validar redirecionamento e carregamento
    // Validate redirection and loading
    await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });
    await validateLoading(page);
  });

  test('Should add a new location with random name and type', async ({ page }) => {
    // 1. Navegar para Locations
    // 1. Navigate to Locations
    console.log('Navigating to Locations...');
    await locationPage.navigateToLocations();
    // await validateLoading(page);
    
    // 2. Clicar em Add Location
    // 2. Click Add Location
    console.log('Clicking Add Location...');
    await locationPage.clickAddLocation();
    
    // 3. Preencher Nome
    // 3. Fill Name
    const randomName = locationPage.generateRandomLocationName();
    console.log(`Generated Location Name: ${randomName}`);
    await locationPage.fillLocationName(randomName);
    
    // 4. Selecionar Código
    // 4. Select Code
    const selectedCode = await locationPage.selectRandomLocationCode();
    console.log(`Selected Location Code: ${selectedCode}`);
    
    // 5. Preencher Endereço
    // 5. Fill Address
    const selectedAddress = await locationPage.fillRandomAddress();
    console.log(`Selected Address: ${selectedAddress}`);

    // 6. Preencher Suite # (Número aleatório)
    // 6. Fill Suite # (Random Number)
    const randomSuite = Math.floor(Math.random() * 1000).toString();
    console.log(`Generated Suite #: ${randomSuite}`);
    await locationPage.fillSuite(randomSuite);
    
    // 7. Preencher Shared Notes
    // 7. Fill Shared Notes
    const randomNotes = `Automated Test Note ${Date.now()}`;
    console.log(`Generated Notes: ${randomNotes}`);
    await locationPage.fillSharedNotes(randomNotes);

    // 8. Preencher Horário de Funcionamento (Working Hours)
    // 8. Fill Working Hours
    console.log('Filling Working Hours randomly...');
    await locationPage.fillWorkingHoursRandomly();

    // Validações visuais (opcional, apenas para garantir que preencheu)
    // Visual validations (optional, just to ensure it filled)
    await expect(locationPage.locationNameInput).toHaveValue(randomName);
    await expect(locationPage.locationCodeSelect).toContainText(selectedCode);
    // Verificar se o input de endereço tem algum valor (pode ser formatado diferente do input original)
    // Verify if address input has some value (might be formatted differently from original input)
    await expect(locationPage.addressInput).not.toBeEmpty();
    // Validar Suite e Notes
    // Validate Suite and Notes
    await expect(locationPage.suiteInput).toHaveValue(randomSuite);
    await expect(locationPage.sharedNotesInput).toHaveValue(randomNotes);
    
    // Validar que pelo menos 6 dias estão abertos (checkbox isClosed não marcado)
    // Validate that at least 6 days are open (isClosed checkbox unchecked)
    const workingHoursContainer = page.locator('[formgroupname="workingHours"]');
    const closedDaysCount = await workingHoursContainer.locator('mat-checkbox[formcontrolname="isClosed"].mat-checkbox-checked').count();
    console.log(`Closed Days Found: ${closedDaysCount}`);
    // Se selecionamos 6 ou 7 dias abertos, então teremos 0 ou 1 dia fechado (num total de 7 dias)
    // If we selected 6 or 7 open days, then we have 0 or 1 closed day (out of 7 total)
    // Como a lógica garante mínimo 6 abertos, então max fechados = 1.
    expect(closedDaysCount).toBeLessThanOrEqual(1);

    // 9. Clicar em Create
    // 9. Click Create
    console.log('Clicking Create button...');
    await locationPage.clickCreate();
    
    // 10. Validar se a localização foi criada na tabela
    // 10. Validate if location was created in the table
    console.log('Validating location creation...');
    await locationPage.validateLocationCreated(randomName);

    // 10.5. Editar a localização e Salvar
    // 10.5. Edit location and Save
    console.log('Editing created location...');
    await locationPage.editLocation(randomName);
    
    // Alterar alguma coisa (ex: Notes)
    // Change something (e.g. Notes)
    const updatedNotes = randomNotes + ' #edited';
    await locationPage.fillSharedNotes(updatedNotes);

    // Esperar 5 segundos após edição
    // Wait 5 seconds after edit
    await page.waitForTimeout(5000);
    
    console.log('Saving changes...');
    await locationPage.clickSaveChanges();

    // Confirmar atualização no modal
    // Confirm update in modal
    console.log('Confirming update...');
    await locationPage.confirmUpdate();
    
    // Navegar de volta para Locations clicando no breadcrumb/link (instrução do usuário)
    // Navigate back to Locations clicking the breadcrumb/link (user instruction)
    console.log('Navigating back to Locations list...');
    // Usar seletor específico para o breadcrumb para evitar conflito com o menu lateral
    // Use specific selector for breadcrumb to avoid conflict with side menu
    await page.locator('a.c-pointer[href="/main/locations/list"]').click();
    
    // Validar retorno para a lista
    // Validate return to list
    await expect(page).toHaveURL(/\/main\/locations/, { timeout: 30000 });

    // 11. Deletar a localização criada
    // 11. Delete the created location
    console.log('Deleting created location...');
    await locationPage.deleteLocation(randomName);

    // 12. Validar se a localização foi deletada
    // 12. Validate if location was deleted
    console.log('Validating location deletion...');
    await locationPage.validateLocationDeleted(randomName);
  });
});
