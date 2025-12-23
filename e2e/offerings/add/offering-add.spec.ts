import { test, expect } from '@playwright/test';

import { OfferingListPage } from '../pages/offering-list.page';
import { OfferingAddPage } from '../pages/offering-add.page';
import { SOLAR_OFFERING_DATA } from '../fixtures/offering-data';

test.describe('Create Offering', () => {
  let listPage: OfferingListPage;
  let formPage: OfferingAddPage;

  test.beforeEach(async ({ page }) => {
    listPage = new OfferingListPage(page);
    formPage = new OfferingAddPage(page);

    await listPage.goto();
    await listPage.clickCreateOffering();
    await formPage.expectToBeOnAddPage();
  });

  test('should create a new solar energy offering successfully', async ({ page }) => {
    await formPage.fillCompleteForm(SOLAR_OFFERING_DATA);
    await formPage.submit();

    await listPage.expectToBeOnListPage();
    await listPage.expectOfferingVisible(SOLAR_OFFERING_DATA.vendor);
  });

  test('should show validation error when vendor name is missing', async ({ page }) => {
    await formPage.selectSourceType(SOLAR_OFFERING_DATA.sourceType);
    await formPage.fillDynamicFields({
      price: SOLAR_OFFERING_DATA.price,
      capacity: SOLAR_OFFERING_DATA.capacity,
      minQuantity: SOLAR_OFFERING_DATA.minQuantity,
      maxQuantity: SOLAR_OFFERING_DATA.maxQuantity,
      location: SOLAR_OFFERING_DATA.location,
    });
    await formPage.submit();

    await formPage.expectValidationError(/please select a source type and enter vendor name/i);
    await formPage.expectToBeOnAddPage();
  });

  test('should navigate back to offerings list when clicking cancel', async ({ page }) => {
    await formPage.cancel();
    await listPage.expectToBeOnListPage();
  });

  test('should navigate back when clicking back button', async ({ page }) => {
    await formPage.goBack();
    await listPage.expectToBeOnListPage();
  });
});
