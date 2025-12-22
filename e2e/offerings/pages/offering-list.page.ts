import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page Object Model for the Offerings List page
 */
export class OfferingListPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.getByRole('button', { name: /create offering/i });
    this.heading = page.getByRole('heading', { name: /energy offerings/i });
  }

  async goto() {
    await this.page.goto('/offerings');
    await this.page.waitForLoadState('networkidle');
  }

  async clickCreateOffering() {
    await expect(this.createButton).toBeVisible();
    await this.createButton.click();
  }

  async expectToBeOnListPage() {
    await expect(this.page).toHaveURL('/offerings');
  }

  async expectOfferingVisible(vendor: string) {
    await expect(this.page.getByText(vendor)).toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.page.getByText(/no offerings yet/i)).toBeVisible();
    await expect(
      this.page.getByText(/start by creating your first energy offering/i),
    ).toBeVisible();
  }
}
