import { OfferingListPage } from '../pages/offering-list.page';
import { OfferingAddPage } from '../pages/offering-add.page';
import { SOLAR_OFFERING_DATA } from './offering-data';
import type { Page } from '@playwright/test';

export async function createOffering(page: Page): Promise<void> {
  const listPage = new OfferingListPage(page);
  const addPage = new OfferingAddPage(page);
  await listPage.goto();
  await listPage.clickCreateOffering();
  await addPage.expectToBeOnAddPage();
  await addPage.fillCompleteForm(SOLAR_OFFERING_DATA);
  await addPage.submit();
  await listPage.expectToBeOnListPage();
}
