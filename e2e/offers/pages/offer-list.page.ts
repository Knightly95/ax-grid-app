import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class OfferListPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /energy offers/i });
    this.table = page.locator('table');
    this.rows = page.locator('[role="row"].MuiDataGrid-row');
  }

  async goto() {
    await this.page.goto('/offers');
    await this.page.waitForLoadState('networkidle');
  }

  async expectToBeOnListPage() {
    await expect(this.page).toHaveURL(/\/offers$/);
    await expect(this.heading).toBeVisible();
  }

  getFirstRow(): Locator {
    return this.rows.first();
  }

  getFirstPendingRow(): Locator {
    return this.rows.filter({ hasNotText: /completed/i }).first();
  }

  getIdCell(row: Locator): Locator {
    return row.locator('[data-field="id"]');
  }

  getStatusCell(row: Locator): Locator {
    return row.locator('[data-field="status"]');
  }

  async openRowActionMenu(row: Locator = this.getFirstRow()) {
    const actionButton = row.locator('button:has([data-testid="MoreVertIcon"])').first();
    await expect(actionButton).toBeVisible();
    await actionButton.click();
  }

  async clickRowAction(actionLabel: string) {
    const menuItem = this.page.getByRole('menuitem', { name: new RegExp(actionLabel, 'i') });
    await expect(menuItem).toBeVisible();
    await menuItem.click();
  }

  async confirmOfferFromRow(row: Locator) {
    await this.openRowActionMenu(row);
    await this.clickRowAction('confirm');
  }

  async expectRowStatus(row: Locator, status: string) {
    await expect(this.getStatusCell(row).getByText(new RegExp(status, 'i'))).toBeVisible();
  }

  async openOfferDetailModal() {
    const modal = this.page.getByRole('dialog', { name: /offer details/i });
    await expect(modal).toBeVisible();
    return modal;
  }

  async closeOfferDetailModal() {
    const closeButton = this.page.getByRole('button', { name: /close|×/i });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(this.page.getByRole('dialog', { name: /offer details/i })).not.toBeVisible();
  }

  async confirmOfferFromModal() {
    const confirmButton = this.page.getByRole('button', { name: /confirm offer/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }

  async expectRowStatusWithId(id: string, status: string) {
    const row = this.rows.filter({ hasText: id }).first();
    await expect(this.getStatusCell(row).getByText(new RegExp(status, 'i'))).toBeVisible();
  }
}
