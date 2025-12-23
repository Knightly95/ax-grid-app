import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { OfferingFormData } from './offering-add.page';

/**
 * Page Object Model for the Offering Edit form
 */
export class OfferingEditPage {
  readonly page: Page;
  readonly vendorInput: Locator;
  readonly sourceTypeChip: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly backButton: Locator;
  readonly idText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.vendorInput = page.getByRole('textbox', { name: /vendor name/i });
    this.sourceTypeChip = page.getByRole('button', { name: /solar|wind|hydro/i });
    this.submitButton = page.getByRole('button', { name: /submit/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.backButton = page.getByRole('button', { name: /back to offerings/i });
    this.idText = page.getByText(/offering id:/i);
  }

  async goto(id: string) {
    await this.page.goto(`/offerings/edit/${id}`);
    await this.page.waitForLoadState('networkidle');
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

  async expectToBeOnEditPage(id: string) {
    await expect(this.page.getByRole('heading', { name: /edit offering/i })).toBeVisible();
    await expect(this.idText).toBeVisible();
  }

  async expectNotFound() {
    await expect(this.page.getByText(/offering not found/i)).toBeVisible();
  }

  async expectPriceVisible(price: string) {
    await expect(this.page.getByText(new RegExp(price))).toBeVisible();
  }
}
