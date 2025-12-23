import { test, expect } from '@playwright/test';

import { OfferingListPage } from '../pages/offering-list.page';
import { OfferingEditPage } from '../pages/offering-edit.page';
import { OfferingAddPage } from '../pages/offering-add.page';
import { SOLAR_OFFERING_DATA } from '../fixtures/offering-data';
import { createOffering } from '../fixtures/offering-helpers';

test.describe('Edit Offering', () => {
  let listPage: OfferingListPage;
  let editPage: OfferingEditPage;

  test.beforeEach(async ({ page }) => {
    listPage = new OfferingListPage(page);
    editPage = new OfferingEditPage(page);

    await createOffering(page);
    await listPage.openEditForFirstCard();
    await editPage.expectToBeOnEditPage(SOLAR_OFFERING_DATA.vendor);
  });

  test('should not show vendor or source type fields in edit form', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /vendor name/i })).toHaveCount(0);
    await expect(page.getByLabel(/source type/i)).toHaveCount(0);
  });

  test('should update the price successfully', async ({ page }) => {
    const NEW_PRICE = '99';
    await editPage.fillDynamicFields({ price: NEW_PRICE });
    await editPage.submit();
    await listPage.expectToBeOnListPage();
    await listPage.expectOfferingVisible(SOLAR_OFFERING_DATA.vendor);
    await editPage.expectPriceVisible(NEW_PRICE);
  });

  test('should navigate back to offerings list when clicking cancel', async ({ page }) => {
    await editPage.cancel();
    await listPage.expectToBeOnListPage();
  });

  test('should navigate back when clicking back button', async ({ page }) => {
    await editPage.goBack();
    await listPage.expectToBeOnListPage();
  });

  test('should show not found for invalid id', async ({ page }) => {
    await editPage.goto('non-existent-id');
    await editPage.expectNotFound();
  });
});
