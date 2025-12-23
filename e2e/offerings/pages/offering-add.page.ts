import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export interface OfferingFormData {
  vendor: string;
  sourceType: 'solar' | 'wind' | 'hydro';
  price: string;
  capacity?: string;
  minQuantity?: string;
  maxQuantity?: string;
  location?: string;
}

/**
 * Page Object Model for the Offering Add/Edit form
 */
export class OfferingAddPage {
  readonly page: Page;
  readonly vendorInput: Locator;
  readonly sourceTypeSelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.vendorInput = page.getByRole('textbox', { name: /vendor name/i });
    this.sourceTypeSelect = page.locator('#sourceType');
    this.submitButton = page.getByRole('button', { name: /submit/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.backButton = page.getByRole('button', { name: /back to offerings/i });
  }

  async goto() {
    await this.page.goto('/offerings/add');
    await this.page.waitForLoadState('networkidle');
  }

  async fillVendor(vendor: string) {
    await expect(this.vendorInput).toBeVisible();
    await this.vendorInput.fill(vendor);
  }

  async selectSourceType(sourceType: string) {
    await this.sourceTypeSelect.click();
    const option = this.page.getByRole('option', { name: new RegExp(sourceType, 'i') });
    await option.click();
    await this.page.waitForTimeout(500);
  }

  async fillDynamicFields(data: Partial<OfferingFormData>) {
    if (data.price) {
      const priceInput = this.page.getByLabel(/price/i).first();
      await priceInput.fill(data.price);
    }

    if (data.capacity) {
      const capacityInput = this.page.getByLabel(/capacity/i);
      if (await capacityInput.isVisible()) {
        await capacityInput.fill(data.capacity);
      }
    }

    if (data.minQuantity) {
      const minQuantityInput = this.page.getByLabel(/min.*quantity/i);
      if (await minQuantityInput.isVisible()) {
        await minQuantityInput.fill(data.minQuantity);
      }
    }

    if (data.maxQuantity) {
      const maxQuantityInput = this.page.getByLabel(/max.*quantity/i);
      if (await maxQuantityInput.isVisible()) {
        await maxQuantityInput.fill(data.maxQuantity);
      }
    }

    if (data.location) {
      const locationInput = this.page.getByLabel(/location/i);
      if (await locationInput.isVisible()) {
        await locationInput.fill(data.location);
      }
    }
  }

  async fillCompleteForm(data: OfferingFormData) {
    await this.fillVendor(data.vendor);
    await this.selectSourceType(data.sourceType);
    await this.fillDynamicFields(data);
  }

  async submit() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

  async cancel() {
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
  }

  async goBack() {
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
  }

  async expectValidationError(message: RegExp | string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectToBeOnAddPage() {
    await expect(this.page).toHaveURL('/offerings/add');
    await expect(this.page.getByRole('heading', { name: /create new offering/i })).toBeVisible();
  }
}
