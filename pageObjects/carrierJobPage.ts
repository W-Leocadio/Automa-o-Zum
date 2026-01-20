import { Page, expect } from '@playwright/test';

export class CarrierJobPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToJobs() {
    // Navega para a página de Jobs clicando no link do menu
    await this.page.getByRole('link', { name: 'Jobs' }).click();
    await expect(this.page).toHaveURL(/.*\/main\/jobs/, { timeout: 15000 });
  }

  async findAndSelectJob(shipmentId: string) {
    // Localiza a linha da tabela que contém o ID do shipment
    const jobRow = this.page.locator('mat-table mat-row').filter({ hasText: shipmentId });
    
    try {
      console.log(`Searching for Job ID: ${shipmentId} in the list...`);
      // Aguarda a linha aparecer na tabela
      await jobRow.waitFor({ state: 'visible', timeout: 30000 });
    } catch (e) {
      console.log(`Job with ID ${shipmentId} not found initially. Reloading page and trying again...`);
      // Se não encontrar, recarrega a página e tenta novamente (pode haver delay de indexação)
      await this.page.reload();
      await expect(this.page).toHaveURL(/.*\/main\/jobs/, { timeout: 15000 });
      
      try {
          await jobRow.waitFor({ state: 'visible', timeout: 45000 });
      } catch (retryError) {
          console.error(`Job with ID ${shipmentId} still not found after reload.`);
          throw retryError;
      }
    }
    // Clica na linha encontrada para abrir os detalhes do Job
    await jobRow.click();
  }

  async assignDriver() {
    // Inicia o processo de atribuir um motorista
    await this.page.getByRole('button', { name: 'Assign Driver' }).click();
    
    await this.page.waitForTimeout(2000); // Aguarda a lista de motoristas estabilizar
    
    const assignButtons = this.page.getByRole('button', { name: 'Assign' });
            await this.page.waitForTimeout(1000);
    const count = await assignButtons.count();
    // Se houver botões de 'Assign' disponíveis, clica no primeiro
    if (count > 0) {
        await assignButtons.first().click();
        await this.page.waitForTimeout(1000);
        // Aguarda o texto do botão mudar para 'Assigned' para confirmar a ação
        await expect(assignButtons.first()).toContainText('Assigned', { timeout: 10000 });
        // Aguarda o processamento
        await this.page.waitForTimeout(1000);
    }
     
    // Clica em 'Continue' para finalizar a atribuição
    const continueButton = this.page.locator('button.mat-primary:has-text("Continue")');
    await expect(continueButton).toBeEnabled({ timeout: 2000 });
    await continueButton.click();
    await this.page.waitForTimeout(1000);
  }

  async signConfirmation() {
    // Clica no botão "Sign It" para iniciar a assinatura da confirmação
    await this.page.getByRole('button', { name: /Sign It/i }).click();
    await this.page.waitForTimeout(1000);

    // Clica novamente se necessário (aqui no passo seguinte existe outo botão)
    // não remover, pois esse step deve existir
    await this.page.getByRole('button', { name: /Sign It/i }).click();
    await this.page.waitForTimeout(1000);


    // Clica em "Sign Document" no modal
    await this.page.getByRole('button', { name: 'Sign Document' }).click();
    await this.page.waitForTimeout(1000);

    // Marca o checkbox de concordância
    await this.page.locator('.mat-checkbox-inner-container').click();
    await this.page.waitForTimeout(1000);

    // Finaliza a assinatura eletrônica
    await this.page.getByRole('button', { name: 'Sign Electronically' }).click();
    await this.page.waitForTimeout(1000);
  }

  async updateStatusToEnRoutePickup() {
    // Atualiza status para: A caminho da coleta
    await this.page.getByRole('link', { name: 'Details' }).click();
    await this.page.getByRole('button', { name: 'En Route to Pickup #' }).click();
    await expect(this.page.getByRole('heading', { name: 'Update Job Status' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('En Route', { exact: true })).toBeVisible();
  }

  async updateStatusToArrivedPickup() {
    // Atualiza status para: Chegou na coleta
    await expect(this.page.getByRole('button', { name: 'Arrived At Pickup #' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Arrived At Pickup #' }).click();
    await expect(this.page.getByText('Are you sure you want to')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    // Valida a mudança visual no mapa/status bar
    await expect(this.page.locator('#job-map-container').getByText('At Pick Up', { exact: true })).toBeVisible();
  }

  async updateStatusToPickupComplete() {
    // Atualiza status para: Coleta Completa
    await expect(this.page.getByRole('button', { name: 'Pickup #1 Complete' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Pickup #1 Complete' }).click();
    await expect(this.page.getByText('Are you sure you want to')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Pickup #1 Blue status bar')).toBeVisible();
  }

  async updateStatusToEnRouteDropoff() {
    // Atualiza status para: A caminho da entrega
    await expect(this.page.getByRole('button', { name: 'En Route to Dropoff #' })).toBeVisible();
    await this.page.getByRole('button', { name: 'En Route to Dropoff #' }).click();
    await expect(this.page.getByText('Are you sure you want to')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Dropoff #1 1/3 black status')).toBeVisible();
  }

  async updateStatusToArrivedDropoff() {
    // Atualiza status para: Chegou na entrega
    await expect(this.page.getByRole('button', { name: 'Arrived At Dropoff #' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Arrived At Dropoff #' }).click();
    await expect(this.page.getByText('Are you sure you want to')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Dropoff #1 2/3 black status')).toBeVisible();
  }

  async updateStatusToLoadDelivered() {
    // Atualiza status para: Carga Entregue (Finalizada)
    await expect(this.page.getByRole('button', { name: 'Load Delivered' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Load Delivered' }).click();
    await expect(this.page.getByText('Are you sure you want to')).toBeVisible();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText('Documents Red Status Bar')).toBeVisible();
  }

  async uploadPOD(podFilePath: string) {
    // Inicia o processo de upload do POD (Proof of Delivery)
    await expect(this.page.getByRole('button', { name: 'Upload POD' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Upload POD' }).click();
    await expect(this.page.getByRole('heading', { name: 'Upload POD' })).toBeVisible();
    
    // Prepara para interceptar o evento de 'filechooser' (janela de seleção de arquivo)
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByRole('button', { name: 'Select Files' }).click();
    const fileChooser = await fileChooserPromise;
    // Define o arquivo a ser enviado
    await fileChooser.setFiles(podFilePath);
    
    // Confirma o upload
    await this.page.getByRole('button', { name: 'Upload' }).click();
    await expect(this.page.getByText('Uploading media')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Job Complete - POD Received' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
    // Valida que o status final de documentos foi atingido
    await expect(this.page.getByText('Documents Blue status bar')).toBeVisible();
  }
}
