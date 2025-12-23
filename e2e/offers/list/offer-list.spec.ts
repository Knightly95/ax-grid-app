import { test, expect } from '@playwright/test';
import { OfferListPage } from '../pages/offer-list.page';

test.describe('Offer List Page', () => {
  let offerListPage: OfferListPage;

  test.beforeEach(async ({ page }) => {
    offerListPage = new OfferListPage(page);
    await offerListPage.goto();
    await offerListPage.expectToBeOnListPage();
  });

  test('should load and display at least one offer row', async ({ page }) => {
    const row = offerListPage.getFirstRow();
    await expect(row).toBeVisible();
  });

  test('should open offer detail modal from row action and close it', async ({ page }) => {
    const row = offerListPage.getFirstRow();
    await offerListPage.openRowActionMenu(row);
    await offerListPage.clickRowAction('view details');
    await offerListPage.closeOfferDetailModal();
  });

  test('should confirm offer from row action and update status', async ({ page }) => {
    const row = offerListPage.getFirstPendingRow();
    const idCell = offerListPage.getIdCell(row);
    const id: string = (await idCell.getAttribute('title')) ?? '';
    await offerListPage.confirmOfferFromRow(row);
    await offerListPage.expectRowStatusWithId(id, 'completed');
  });

  test('should confirm offer from modal and update status', async ({ page }) => {
    const row = offerListPage.getFirstPendingRow();
    const idCell = offerListPage.getIdCell(row);
    const id: string = (await idCell.getAttribute('title')) ?? '';
    await offerListPage.openRowActionMenu(row);
    await offerListPage.clickRowAction('view details');
    await offerListPage.confirmOfferFromModal();
    await offerListPage.expectRowStatusWithId(id, 'completed');
  });
});
