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
  contractTerms?: string;
  paymentTerms?: string;
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
    this.sourceTypeSelect = page.locator('#sourceType');
    this.vendorInput = page.getByRole('textbox', { name: /vendor name/i });
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
    const textFields: Array<{ key: keyof OfferingFormData; label: RegExp }> = [
      { key: 'price', label: /price/i },
      { key: 'capacity', label: /capacity/i },
      { key: 'minQuantity', label: /min.*quantity/i },
      { key: 'maxQuantity', label: /max.*quantity/i },
      { key: 'location', label: /location/i },
    ];

    for (const { key, label } of textFields) {
      const value = data[key as keyof typeof data];
      if (value) {
        const input = this.page.getByLabel(label);
        if (await input.isVisible()) {
          await input.fill(value);
        }
      }
    }

    const selectFields: Array<{ key: keyof OfferingFormData; selector: string }> = [
      { key: 'contractTerms', selector: '#contractTerms' },
      { key: 'paymentTerms', selector: '#paymentTerms' },
    ];

    for (const { key, selector } of selectFields) {
      const dropdown = this.page.locator(selector);
      if (await dropdown.isVisible()) {
        await dropdown.click();
        const value = data[key as keyof typeof data];
        let option;
        if (value) {
          option = this.page.locator(`li[role="option"][data-value="${value}"]`).first();
          if (!(await option.isVisible())) {
            option = this.page.locator('li[role="option"][data-value]:not([data-value=""])').first();
          }
        } else {
          option = this.page.locator('li[role="option"][data-value]:not([data-value=""])').first();
        }
        await option.click();
      }
    }
  }

  async fillCompleteForm(data: OfferingFormData) {
    await this.selectSourceType(data.sourceType);
    await this.fillVendor(data.vendor);
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
