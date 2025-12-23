import { vi } from 'vitest';

export const mockSetOffers = vi.fn();
export const mockAddOffer = vi.fn();
export const mockUpdateOffer = vi.fn();
export const mockRemoveOffer = vi.fn();
export const mockSetConnectionStatus = vi.fn();
export const mockSetMetrics = vi.fn();
export const mockClearOffers = vi.fn();

export function mockUseOffersStore() {
  return {
    setOffers: mockSetOffers,
    addOffer: mockAddOffer,
    updateOffer: mockUpdateOffer,
    removeOffer: mockRemoveOffer,
    setConnectionStatus: mockSetConnectionStatus,
    setMetrics: mockSetMetrics,
    clearOffers: mockClearOffers,
  };
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
};

export function resetSocketServiceMocks() {
  Object.values(mockSocketService).forEach((fn) => fn.mockClear?.());
}
