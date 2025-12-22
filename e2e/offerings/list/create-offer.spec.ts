import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import { OfferingListPage } from '../pages/offering-list.page';
import { SOLAR_OFFERING_DATA } from '../fixtures/offering-data';
import { createOffering } from '../fixtures/offering-helpers';

test.describe('Create Offer from Offerings List', () => {
  let listPage: OfferingListPage;

  test.beforeEach(async ({ page }) => {
    listPage = new OfferingListPage(page);
    await createOffering(page);
    await listPage.expectOfferingVisible(SOLAR_OFFERING_DATA.vendor);
  });

  test('should open create offer modal, submit, and redirect to offers', async ({ page }) => {
    // Open the create offer modal for the first offering card
    await listPage.openCreateOfferModalForFirstCard();
    // Use POM to fill quantity and submit
    await listPage.fillQuantityAndSubmit('25');
    // Use POM to assert redirect
    await listPage.expectRedirectToOffers();
  });
});
