import { vi } from 'vitest';

export const mockSetOffers = vi.fn();
export const mockAddOffer = vi.fn();
export const mockUpdateOffer = vi.fn();
export const mockRemoveOffer = vi.fn();
export const mockSetConnectionStatus = vi.fn();
export const mockSetMetrics = vi.fn();
export const mockClearOffers = vi.fn();

import type { OffersState } from '@/store/offersStore';
export function mockUseOffersStore<T = Partial<OffersState>>(
  selector?: (s: Partial<OffersState>) => T,
): T {
  const store = {
    setOffers: mockSetOffers,
    addOffer: mockAddOffer,
    updateOffer: mockUpdateOffer,
    removeOffer: mockRemoveOffer,
    setConnectionStatus: mockSetConnectionStatus,
    setMetrics: mockSetMetrics,
    clearOffers: mockClearOffers,
  };
  return typeof selector === 'function' ? selector(store) : (store as T);
}

export function resetOfferStoreMocks() {
  mockSetOffers.mockReset();
  mockAddOffer.mockReset();
  mockUpdateOffer.mockReset();
  mockRemoveOffer.mockReset();
  mockSetConnectionStatus.mockReset();
  mockSetMetrics.mockReset();
  mockClearOffers.mockReset();
}

export const mockSocketService = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  removeAllListeners: vi.fn(),
  onOffersInit: vi.fn(),
  onOfferCreated: vi.fn(),
  onOfferUpdated: vi.fn(),
  onOfferRemoved: vi.fn(),
  onOpsMetric: vi.fn(),
  getConnectionStatus: vi.fn(() => 'connected'),
  requestOffersList: vi.fn(),
  setOfferPending: vi.fn(),
  setOfferProcessing: vi.fn(),
  setOfferCompleted: vi.fn(),
  isConnected: vi.fn(() => true),
  getSocket: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
  })),
};

export function resetSocketServiceMocks() {
  Object.values(mockSocketService).forEach((fn) => fn.mockClear?.());
}
