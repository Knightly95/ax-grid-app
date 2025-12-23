import type { StoreApi } from 'zustand';
import type { OffersState } from '../offersStore';
import type { Offer } from '@/shared/types/offer';
import { useOfferingsStore } from '../offeringsStore';
import { SourceTypeEnum } from '@/shared/types/offering';
import type { Offering } from '@/shared/types/offering';

export function resetOfferingsStore() {
  useOfferingsStore.getState().clearOfferings();
}

export function createTestSolarOffering(
  overrides: Partial<Omit<Offering, 'id' | 'createdAt' | 'updatedAt'>> = {},
) {
  return {
    sourceType: SourceTypeEnum.SOLAR,
    vendor: 'TestVendor',
    price: 100,
    minQuantity: 10,
    capacity: 200,
    contractTerms: '12 months',
    paymentTerms: 'Net 30',
    ...overrides,
  };
}

export function createMockOffer(overrides?: Partial<Offer>): Offer {
  return {
    id: '1',
    vendor: 'VendorA',
    price: 100,
    createdAt: 1766339257324,
    updatedAt: 1766339257324,
    ...overrides,
  } as Offer;
}

export function resetOffersStore(store: StoreApi<OffersState>) {
  store.getState().clearOffers();
  store.getState().setConnectionStatus('disconnected');
}
