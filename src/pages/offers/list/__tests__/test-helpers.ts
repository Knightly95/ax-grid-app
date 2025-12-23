import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function openRowActionsMenuByVendor(vendor: string): Promise<void> {
  const vendorCell = screen.getByText(vendor);
  const row = vendorCell.closest('[role="row"]');
  const rowMenuButton = row?.querySelector('button svg')?.parentElement as HTMLElement;
  await userEvent.click(rowMenuButton);
}

export async function clickMenuItem(label: string | RegExp): Promise<void> {
  const item = await screen.findByText(label);
  await userEvent.click(item);
}
import type { Offer } from '@/shared/types/offer';

export function getMockOffers(): Offer[] {
  return [
    {
      id: '2f96a40c-a4bb-4023-bb28-b706ab7c1606',
      sourceType: 'solar',
      price: 102,
      quantity: 49,
      unit: 'MWh',
      status: 'completed',
      vendor: 'EcoEnergy Ltd',
      location: 'Málaga, ES',
      createdAt: 1766339257323,
      updatedAt: 1766432476627,
    },
    {
      id: '3f96a40c-a4bb-4023-bb28-b706ab7c1607',
      sourceType: 'wind',
      price: 99,
      quantity: 30,
      unit: 'MWh',
      status: 'pending',
      vendor: 'WindPower Inc',
      location: 'Bilbao, ES',
      createdAt: 1766339257324,
      updatedAt: 1766432476628,
    },
  ];
}

export const mockSolarOffer: Offer = getMockOffers()[0];
export const mockWindOffer: Offer = getMockOffers()[1];
