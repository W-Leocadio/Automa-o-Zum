import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';
import { FtlShipmentPage } from '../../../pageObjects/ftlShipmentPage';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Broker Shipment Creation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page, 'broker');

    await loginPage.goto(process.env.BASE_URL_BROKER!);
    await loginPage.login(
      process.env.BROKER_USER_EMAIL!,
      process.env.BROKER_USER_PASSWORD!
    );
    await expect(page).toHaveURL(/.*\/main/, { timeout: 30000 });
  });

  test('Create and tender FTL shipment as broker', async ({ page }) => {
    const shipmentPage = new FtlShipmentPage(page);

    await shipmentPage.openBuildShipment();
    await shipmentPage.fillCustomerAndPricing();
    await shipmentPage.fillPickupDetails();
    await shipmentPage.fillDropoffDetails();
    await shipmentPage.fillLoadDetails();
    await shipmentPage.tenderToCarrier();

    // Capture Shipment ID from URL
    await expect(page).toHaveURL(/.*\/shipments\/\d+\/.*/, { timeout: 30000 });
    const url = page.url();
    const match = url.match(/\/shipments\/(\d+)\//);

    if (match && match[1]) {
      const shipmentId = match[1];
      console.log(`Shipment created with ID: ${shipmentId}`);
      
      // Save ID to a file for other tests to use
      const dataPath = path.resolve(__dirname, '../../../temp');
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true });
      }
      fs.writeFileSync(path.join(dataPath, 'shipment_data.json'), JSON.stringify({ shipmentId }));
    } else {
      throw new Error(`Failed to capture shipment ID from URL: ${url}`);
    }
  });
});
