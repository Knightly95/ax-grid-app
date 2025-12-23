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

  /**
   * Returns the first offering card on the list page.
   */
  getFirstCard() {
    return this.page.getByTestId('offering-card').first();
  }

  async openEditForFirstCard() {
    const card = this.getFirstCard();
    const menuButton = card.getByRole('button', { name: /more actions/i });
    await menuButton.click();
    const editMenuItem = this.page.getByRole('menuitem', { name: /edit/i });
    await editMenuItem.click();
  }

  async openCreateOfferModalForFirstCard() {
    const card = this.getFirstCard();
    const createOfferButton = card.getByRole('button', { name: /create offer/i });
    await createOfferButton.click();
  }

  async fillQuantityAndSubmit(quantity: string) {
    const quantityInput = this.page.getByLabel(/quantity/i);
    await expect(quantityInput).toBeVisible();
    await quantityInput.fill(quantity);
    const submitButton = this.page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
  }

  async expectRedirectToOffers() {
    await expect(this.page).toHaveURL(/\/offers$/);
  }
}
