import { useOffersStore } from '../offersStore';
import { createMockOffer, resetOffersStore } from './test-helpers';

describe('useOffersStore', () => {
  const mockOffer1 = createMockOffer();
  const mockOffer2 = createMockOffer({
    id: '2',
    vendor: 'VendorB',
    price: 200,
    createdAt: 1766339257324,
    updatedAt: 1766339257324,
  });

  beforeEach(() => {
    resetOffersStore(useOffersStore);
  });

  it('should initialize with empty offers', () => {
    expect(useOffersStore.getState().offers).toEqual([]);
    expect(useOffersStore.getState().metrics).toBeNull();
    expect(useOffersStore.getState().connectionStatus).toBe('disconnected');
  });

  it('should set offers', () => {
    useOffersStore.getState().setOffers([mockOffer1, mockOffer2]);
    expect(useOffersStore.getState().offers).toEqual([mockOffer1, mockOffer2]);
  });

  it('should add an offer', () => {
    useOffersStore.getState().addOffer(mockOffer1);
    expect(useOffersStore.getState().offers).toEqual([mockOffer1]);
  });

  it('should update an offer', () => {
    useOffersStore.getState().setOffers([mockOffer1]);
    const updated = { ...mockOffer1, vendor: 'UpdatedVendor' };
    useOffersStore.getState().updateOffer(updated);
    expect(useOffersStore.getState().offers[0].vendor).toBe('UpdatedVendor');
  });

  it('should remove an offer', () => {
    useOffersStore.getState().setOffers([mockOffer1, mockOffer2]);
    useOffersStore.getState().removeOffer(mockOffer1.id);
    expect(useOffersStore.getState().offers).toEqual([mockOffer2]);
  });

  it('should clear all offers and metrics', () => {
    useOffersStore.getState().setOffers([mockOffer1, mockOffer2]);
    useOffersStore.getState().setMetrics({ totalOffers: 2, avgPrice: 150 });
    useOffersStore.getState().clearOffers();
    expect(useOffersStore.getState().offers).toEqual([]);
    expect(useOffersStore.getState().metrics).toBeNull();
  });

  it('should get offer by id', () => {
    useOffersStore.getState().setOffers([mockOffer1, mockOffer2]);
    const found = useOffersStore.getState().getOfferById(mockOffer2.id);
    expect(found).toEqual(mockOffer2);
  });

  it('should set connection status', () => {
    useOffersStore.getState().setConnectionStatus('connected');
    expect(useOffersStore.getState().connectionStatus).toBe('connected');
  });

  it('should set metrics', () => {
    const metrics = { totalOffers: 2, avgPrice: 150 };
    useOffersStore.getState().setMetrics(metrics);
    expect(useOffersStore.getState().metrics).toEqual(metrics);
  });
});
