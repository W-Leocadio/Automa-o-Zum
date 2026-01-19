import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pageObjects/loginPage';
import { FtlShipmentPage } from '../../../pageObjects/ftlShipmentPage';


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
});
