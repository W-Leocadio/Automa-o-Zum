import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';
import { FtlShipmentPage } from '../../../pageObjects/ftlShipmentPage';
import { CarrierJobPage } from '../../../pageObjects/carrierJobPage';
import * as path from 'path';

test.describe('Carrier Full Flow with Broker Setup', () => {
  // Increase timeout for this long end-to-end test flow including setup
  test.setTimeout(300000); // 5 minutes

  let shipmentId: string;

  test.beforeAll(async ({ browser }) => {
    // Configura um timeout maior para o setup, pois envolve criar uma carga completa
    test.setTimeout(300000); 
    console.log('Starting Setup: Creating FTL Shipment as Broker...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // 1. Realiza Login como Broker para criar a carga
      const loginPage = new LoginPage(page, 'broker');
      await loginPage.goto(process.env.BASE_URL_BROKER!);
      await loginPage.login(
        process.env.BROKER_USER_EMAIL!,
        process.env.BROKER_USER_PASSWORD!
      );
      // Verifica se o login foi bem-sucedido e estamos na página principal
      await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });

      // 2. Inicia o fluxo de criação de Shipment (Carga)
      const shipmentPage = new FtlShipmentPage(page);
      await shipmentPage.openBuildShipment(); // Abre a tela de criação
      await shipmentPage.fillCustomerAndPricing(); // Preenche dados do cliente e preço
      await shipmentPage.fillPickupDetails(); // Preenche dados de coleta (origem)
      await shipmentPage.fillDropoffDetails(); // Preenche dados de entrega (destino)
      await shipmentPage.fillLoadDetails(); // Preenche detalhes da carga (peso, tipo)
      await shipmentPage.tenderToCarrier(); // Envia a carga para a transportadora (Carrier)

      // 3. Captura o ID do Shipment gerado a partir da URL
      // Isso é crucial para que o teste do Carrier saiba qual carga buscar
      await expect(page).toHaveURL(/.*\/shipments\/\d+\/.*/, { timeout: 30000 });
      const url = page.url();
      const match = url.match(/\/shipments\/(\d+)\//);
      
      if (match && match[1]) {
        shipmentId = match[1];
        console.log(`Setup Success: Shipment created with ID: ${shipmentId}`);
      } else {
        throw new Error(`Failed to capture shipment ID from URL: ${url}`);
      }

    } catch (error) {
      console.error('Setup Failed:', error);
      throw error;
    } finally {
      await context.close();
    }
  });

  test('Carrier completes the job flow', async ({ page }) => {
    // Garante que o ID do shipment foi capturado corretamente no setup
    expect(shipmentId, 'Shipment ID must be defined from setup step').toBeDefined();

    console.log(`Starting Carrier Flow for Shipment ID: ${shipmentId}`);

    // 1. Realiza Login como Carrier (Transportadora)
    const loginPage = new LoginPage(page, 'carrier');
    await loginPage.goto(process.env.BASE_URL_CARRIER!);
    await loginPage.login(process.env.CARRIER_USER_EMAIL!, process.env.CARRIER_USER_PASSWORD!);
    await expect(page).toHaveURL(/.*\/main\/shipments/, { timeout: 30000 });

    const carrierJobPage = new CarrierJobPage(page);

    // 2. Navega até a lista de Jobs (Trabalhos)
    await carrierJobPage.navigateToJobs();
    
    // 3. Busca e seleciona o Job específico pelo ID capturado
    await carrierJobPage.findAndSelectJob(shipmentId);

    // 4. Executa o fluxo de trabalho do Job (Aceite -> Entrega)
    await carrierJobPage.assignDriver(); // Atribui motorista
    await carrierJobPage.signConfirmation(); // Assina a confirmação (Rate Confirmation)
    
    // Atualizações de Status (Rastreamento)
    await carrierJobPage.updateStatusToEnRoutePickup(); // A caminho da coleta
    await carrierJobPage.updateStatusToArrivedPickup(); // Chegou na coleta
    await carrierJobPage.updateStatusToPickupComplete(); // Coleta finalizada
    
    await carrierJobPage.updateStatusToEnRouteDropoff(); // A caminho da entrega
    await carrierJobPage.updateStatusToArrivedDropoff(); // Chegou na entrega
    await carrierJobPage.updateStatusToLoadDelivered(); // Carga entregue
    
    // 5. Faz o upload do comprovante de entrega (POD)
    // O caminho do arquivo deve ser válido na máquina local
    const podPath = 'C:\\Users\\wesml\\Documents\\trae_projects\\Automacao-Wesley\\uplodfile\\POD.jpg';
    await carrierJobPage.uploadPOD(podPath);
  });
});
