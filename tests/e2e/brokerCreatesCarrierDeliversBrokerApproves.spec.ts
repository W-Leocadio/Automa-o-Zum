import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/loginPage';
import { FtlShipmentPage } from '../../pageObjects/ftlShipmentPage';
import { CarrierJobPage } from '../../pageObjects/carrierJobPage';

test.describe('E2E Full Cycle: Create -> Deliver -> Approve @e2e', () => {
  // Aumenta o timeout para este teste longo e completo
  // Increases the timeout for this long and complete test
  test.setTimeout(600000); // 10 minutos no total

  let shipmentId: string;

  test('Should complete the full shipment lifecycle', async ({ browser }, testInfo) => {
    
    // ========================================================================
    // PASSO 1: BROKER CRIA A CARGA (SHIPMENT)
    // STEP 1: BROKER CREATES THE SHIPMENT
    // ========================================================================
    console.log('--- Step 1: Broker Creates Shipment ---');
    // Configura explicitamente a gravação de vídeo (REMOVIDO A PEDIDO)
    // Explicitly configures video recording (REMOVED PER REQUEST)
    const brokerContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const brokerPage = await brokerContext.newPage();

    try {
      const loginPage = new LoginPage(brokerPage, 'broker');
      await loginPage.goto(process.env.BASE_URL_BROKER!);
      await loginPage.login(
        process.env.BROKER_USER_EMAIL!,
        process.env.BROKER_USER_PASSWORD!
      );
      await expect(brokerPage).toHaveURL(/.*\/main/, { timeout: 30000 });

      const shipmentPage = new FtlShipmentPage(brokerPage);
      await shipmentPage.openBuildShipment();
      await shipmentPage.fillCustomerAndPricing();
      await shipmentPage.fillPickupDetails();
      await shipmentPage.fillDropoffDetails();
      await shipmentPage.fillLoadDetails();
      await shipmentPage.tenderToCarrier();

      await expect(brokerPage).toHaveURL(/.*\/shipments\/\d+\/.*/, { timeout: 30000 });
      const url = brokerPage.url();
      const match = url.match(/\/shipments\/(\d+)\//);
      
      if (match && match[1]) {
        shipmentId = match[1];
        console.log(`Setup Success: Shipment created with ID: ${shipmentId}`);
      } else {
        throw new Error(`Failed to capture shipment ID from URL: ${url}`);
      }
    } finally {
      await brokerContext.close();
    }

    // ========================================================================
    // PASSO 2: CARRIER ACEITA E ENTREGA A CARGA
    // STEP 2: CARRIER ACCEPTS AND DELIVERS THE SHIPMENT
    // ========================================================================
    console.log(`--- Step 2: Carrier Delivers Shipment ID: ${shipmentId} ---`);
    // Configura explicitamente a gravação de vídeo
    // Explicitly configures video recording
    const carrierContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: 'test-results/videos/', size: { width: 1920, height: 1080 } }
    });
    const carrierPage = await carrierContext.newPage();
    
    try {
      const loginPage = new LoginPage(carrierPage, 'carrier');
      await loginPage.goto(process.env.BASE_URL_CARRIER!);
      await loginPage.login(process.env.CARRIER_USER_EMAIL!, process.env.CARRIER_USER_PASSWORD!);
      await expect(carrierPage).toHaveURL(/.*\/main\/shipments/, { timeout: 30000 });

      const carrierJobPage = new CarrierJobPage(carrierPage);
      await carrierJobPage.navigateToJobs();
      await carrierJobPage.findAndSelectJob(shipmentId);
      await carrierJobPage.assignDriver();
      await carrierJobPage.signConfirmation();
      
      // Atualizações de Status
      // Status Updates
      await carrierJobPage.updateStatusToEnRoutePickup();
      await carrierJobPage.updateStatusToArrivedPickup();
      await carrierJobPage.updateStatusToPickupComplete();
      
      await carrierJobPage.updateStatusToEnRouteDropoff();
      await carrierJobPage.updateStatusToArrivedDropoff();
      await carrierJobPage.updateStatusToLoadDelivered();
      
      // Upload do POD
      // POD Upload
      const podPath = 'C:\\Users\\wesml\\Documents\\trae_projects\\Automacao-Wesley\\uplodfile\\POD.jpg';
      await carrierJobPage.uploadPOD(podPath);
    } finally {
      await carrierContext.close();
    }

    // ========================================================================
    // PASSO 3: BROKER APROVA O POD
    // STEP 3: BROKER APPROVES THE POD
    // ========================================================================
    console.log(`--- Step 3: Broker Approves POD for Shipment ID: ${shipmentId} ---`);
    // Configura explicitamente a gravação de vídeo (REMOVIDO A PEDIDO)
    // Explicitly configures video recording (REMOVED PER REQUEST)
    const brokerApprovalContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await brokerApprovalContext.newPage(); // Reusando nome 'page' para facilitar cópia do código original
    // Reusing the name 'page' to facilitate copying from the original code

    try {
      // Realiza Login como Broker
      // Performs Login as Broker
      const loginPage = new LoginPage(page, 'broker');
      await loginPage.goto(process.env.BASE_URL_BROKER!);
      await loginPage.login(
        process.env.BROKER_USER_EMAIL!,
        process.env.BROKER_USER_PASSWORD!
      );
      await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });

      const shipmentPage = new FtlShipmentPage(page);

      // Encontra e abre o shipment na grid, garantindo que o POD foi recebido
      // Finds and opens the shipment in the grid, ensuring the POD was received
      await shipmentPage.findAndOpenShipment(shipmentId);

      // Executa o fluxo de aprovação de POD e review do carrier
      // Executes the POD approval flow and carrier review
      await shipmentPage.approvePod();


    } finally {
      await brokerApprovalContext.close();
    }
  });
});
