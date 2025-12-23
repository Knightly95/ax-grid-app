import { test, expect } from '@playwright/test';

import { OfferingListPage } from '../pages/offering-list.page';

test.describe('Offering List', () => {
  let listPage: OfferingListPage;

  test.beforeEach(async ({ page }) => {
    listPage = new OfferingListPage(page);
    await listPage.goto();
  });

  test('should display the offerings list page', async ({ page }) => {
    await expect(listPage.heading).toBeVisible();
    await expect(listPage.createButton).toBeVisible();
  });

  test('should show empty state when no offerings exist', async ({ page }) => {
    const hasOfferings = await page
      .getByText('SolarCorp')
      .isVisible()
      .catch(() => false);

    if (!hasOfferings) {
      await listPage.expectEmptyState();
    }
  });

  test('should navigate to create offering page when clicking create button', async ({ page }) => {
    await listPage.clickCreateOffering();
    await expect(page).toHaveURL('/offerings/add');
  });
});
