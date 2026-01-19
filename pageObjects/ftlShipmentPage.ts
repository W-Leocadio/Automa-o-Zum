import { Page, expect } from '@playwright/test';

export class FtlShipmentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openBuildShipment() {
    await this.page.locator('//*[text()="Build Shipment"]/../..').waitFor();
    try {
      await expect(this.page.getByText('Loading Shipments...', { exact: false })).toBeHidden({ timeout: 10000 });
    } catch {
      // If still visible, reload and wait again
      await this.page.reload();
      await expect(this.page.getByText('Loading Shipments...', { exact: false })).toBeHidden({ timeout: 10000 });
    }
    await this.page.locator('//*[text()="Build Shipment"]/../..').waitFor({ state: 'visible' });
    await this.page.locator('//*[text()="Build Shipment"]/../..').click();
    await this.page.waitForTimeout(1000);
  }


  async fillCustomerAndPricing() {
    const customerInput = this.page.locator('input[data-placeholder="Customer"]');

    await customerInput.waitFor({ state: 'visible' });
    await customerInput.click();
    await this.page.waitForTimeout(1000); // Wait for dropdown to open

    const wesleyCompanyOption = this.page.getByText('Wesley Company', { exact: true });
    // Removed strict waitFor, relying on click timeout + previous delay
    await wesleyCompanyOption.click({ timeout: 15000 });
    await this.page.waitForTimeout(1000);

    await this.page
      .getByRole('textbox', { name: 'Customer Price' })
      .fill('9000.');
    await this.page.waitForTimeout(1000);

    await this.page.locator('div').filter({ hasText: /^Customer Representative$/ }).nth(1).click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);

    await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
    await this.page.waitForTimeout(1000);

    await this.page.locator('.cdk-overlay-backdrop').click();
    await this.page.waitForTimeout(1000);
    //await this.page.getByText('Wesley Leocadio Customer').click();
    //await this.page.locator('.cdk-overlay-backdrop').click();

    await this.page.locator('#mat-select-value-9').click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText('Post Out for Quotes').click();
    await this.page.waitForTimeout(1000);

    await this.page.getByRole('combobox', { name: 'Service Type' }).locator('span').click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText('- Service Expedite').click();
    await this.page.waitForTimeout(1000);

    //await this.page.locator('div').filter({ hasText: /^Sales Person$/ }).nth(2).click();
    //await this.page.getByRole('option', { name: 'Wesley Leocadio' }).click();
  }

  async fillPickupDetails() {

    await this.page.locator('//*[contains(@class, "pickup")]//*[text()="Location Name (search by name or ID)"]/../../preceding-sibling::input').fill('Best Buy Xbox DC');
    await this.page.waitForTimeout(1000);

    await this.page.locator('.location-name').first().click();
    await this.page.waitForTimeout(1000);

    await this.page.locator('//*[contains(@class, "pickup")]//*[@placeholder="Appointment Type"]').first().click();
    await this.page.waitForTimeout(1000);

    await this.page
      .getByRole('option', { name: 'TBD' })
      .click();
    await this.page.waitForTimeout(1000);
  }

  async fillDropoffDetails() {
    const locationInput = this.page.locator('//*[contains(@class, "dropoff")]//*[text()="Location Name (search by name or ID)"]/../../preceding-sibling::input');

    await locationInput.waitFor({ state: 'visible', timeout: 15000 });
    await locationInput.click();
    await this.page.waitForTimeout(1000);

    await locationInput.fill('new york');
    await this.page.waitForTimeout(1000);

    const firstOption = this.page.locator('.cdk-overlay-pane .location-name').first();
    await firstOption.waitFor({ state: 'visible', timeout: 15000 });
    await firstOption.click();
    await this.page.waitForTimeout(1000);


    await this.page.locator('//*[contains(@class, "dropoff")]//*[@placeholder="Appointment Type"]').click();
    await this.page.waitForTimeout(1000);

    const panel = this.page.locator('[role="listbox"].mat-select-panel');
    await panel.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('option', { name: 'TBD' }).click();
    await this.page.waitForTimeout(1000);
  }


  async fillLoadDetails() {

    await this.page
      .getByRole('textbox', { name: 'Total Load Weight (lbs)' })
      .click();
    await this.page.waitForTimeout(1000);

    await this.page
      .getByRole('textbox', { name: 'Total Load Weight (lbs)' })
      .fill('9000');
    await this.page.waitForTimeout(1000);

    await this.page
      .locator('div')
      .filter({ hasText: /^Commodity Code \*$/ })
      .nth(2)
      .click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText('METALS - METALS').click();
    await this.page.waitForTimeout(1000);

    await this.page
      .locator('div')
      .filter({ hasText: /^Equipment Type \*$/ })
      .nth(2)
      .click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText("48' Dry Van", { exact: true }).click();
    await this.page.waitForTimeout(1000);

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  async tenderToCarrier() {
    const submitButton = this.page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible', timeout: 15000 });
    await submitButton.click();
    await this.page.waitForTimeout(1000);

    // Only click Cancel if it appears
    try {
      await this.page.getByRole('button', { name: 'Cancel' }).click({ timeout: 5000 });
      await this.page.waitForTimeout(1000);
    } catch {
      // Cancel button did not appear, continue
    }
    
    // Removed the second cancel click that was outside the try/catch block to prevent errors
  }
}
