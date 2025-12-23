import { vi } from 'vitest';
import type { Mock } from 'vitest';

import {
  mockSetOffers,
  mockAddOffer,
  mockUpdateOffer,
  mockRemoveOffer,
  mockSetConnectionStatus,
  mockSetMetrics,
  mockClearOffers,
  mockUseOffersStore,
  resetOfferStoreMocks,
  mockSocketService,
  resetSocketServiceMocks,
} from './test-helpers';

vi.mock('@/store/offersStore', () => ({
  useOffersStore: () => mockUseOffersStore(),
  __mocks: {
    mockSetOffers,
    mockAddOffer,
    mockUpdateOffer,
    mockRemoveOffer,
    mockSetConnectionStatus,
    mockSetMetrics,
    mockClearOffers,
  },
}));

vi.mock('@/shared/services/socket/socketService', () => ({
  socketService: mockSocketService,
  __mocks: mockSocketService,
}));

import * as OffersStoreImport from '@/store/offersStore';
import * as SocketServiceImport from '@/shared/services/socket/socketService';
import { renderHook } from '@testing-library/react';
import { useSocket } from '../useSocket';

const OffersStore = OffersStoreImport as typeof OffersStoreImport & {
  __mocks: Record<string, Mock>;
};
const SocketService = SocketServiceImport as typeof SocketServiceImport & {
  __mocks: Record<string, Mock>;
};

describe('useSocket', () => {
  beforeEach(() => {
    resetOfferStoreMocks();
    resetSocketServiceMocks();
  });

  it('connects and sets status on mount', () => {
    renderHook(() => useSocket());
    expect(SocketService.__mocks.connect).toHaveBeenCalled();
    expect(OffersStore.__mocks.mockSetConnectionStatus).toHaveBeenCalledWith('connecting');
  });

  it('registers all socket event handlers', () => {
    renderHook(() => useSocket());
    expect(SocketService.__mocks.onOffersInit).toHaveBeenCalled();
    expect(SocketService.__mocks.onOfferCreated).toHaveBeenCalled();
    expect(SocketService.__mocks.onOfferUpdated).toHaveBeenCalled();
    expect(SocketService.__mocks.onOfferRemoved).toHaveBeenCalled();
    expect(SocketService.__mocks.onOpsMetric).toHaveBeenCalled();
  });

  it('handles offers init event', () => {
    let offersHandler: (offers: Array<{ id: string }>) => void = () => {};
    SocketService.__mocks.onOffersInit.mockImplementationOnce((cb: typeof offersHandler) => {
      offersHandler = cb;
    });
    renderHook(() => useSocket());
    const offers = [{ id: '1' }];
    offersHandler(offers);
    expect(OffersStore.__mocks.mockSetOffers).toHaveBeenCalledWith(offers);
    expect(OffersStore.__mocks.mockSetConnectionStatus).toHaveBeenCalledWith('connected');
  });

  it('handles offer created event', () => {
    let handler: (offer: { id: string }) => void = () => {};
    SocketService.__mocks.onOfferCreated.mockImplementationOnce((cb: typeof handler) => {
      handler = cb;
    });
    renderHook(() => useSocket());
    const offer = { id: '2' };
    handler(offer);
    expect(OffersStore.__mocks.mockAddOffer).toHaveBeenCalledWith(offer);
  });

  it('handles offer updated event', () => {
    let handler: (offer: { id: string; status: string }) => void = () => {};
    SocketService.__mocks.onOfferUpdated.mockImplementationOnce((cb: typeof handler) => {
      handler = cb;
    });
    renderHook(() => useSocket());
    const offer = { id: '3', status: 'active' };
    handler(offer);
    expect(OffersStore.__mocks.mockUpdateOffer).toHaveBeenCalledWith(offer);
  });

  it('handles offer removed event', () => {
    let handler: (payload: { id: string }) => void = () => {};
    SocketService.__mocks.onOfferRemoved.mockImplementationOnce((cb: typeof handler) => {
      handler = cb;
    });
    renderHook(() => useSocket());
    handler({ id: '4' });
    expect(OffersStore.__mocks.mockRemoveOffer).toHaveBeenCalledWith('4');
  });

  it('handles metrics event', () => {
    let handler: (metrics: Record<string, unknown>) => void = () => {};
    SocketService.__mocks.onOpsMetric.mockImplementationOnce((cb: typeof handler) => {
      handler = cb;
    });
    renderHook(() => useSocket());
    const metrics = { count: 1 };
    handler(metrics);
    expect(OffersStore.__mocks.mockSetMetrics).toHaveBeenCalledWith(metrics);
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useSocket());
    unmount();
    expect(SocketService.__mocks.removeAllListeners).toHaveBeenCalled();
    expect(SocketService.__mocks.disconnect).toHaveBeenCalled();
    expect(OffersStore.__mocks.mockClearOffers).toHaveBeenCalled();
    expect(OffersStore.__mocks.mockSetConnectionStatus).toHaveBeenCalledWith('disconnected');
  });

  it('exposes imperative methods', () => {
    const { result } = renderHook(() => useSocket());
    result.current.requestOffersList();
    expect(SocketService.__mocks.requestOffersList).toHaveBeenCalled();
    result.current.setOfferPending('id1');
    expect(SocketService.__mocks.setOfferPending).toHaveBeenCalledWith('id1');
    result.current.setOfferProcessing('id2');
    expect(SocketService.__mocks.setOfferProcessing).toHaveBeenCalledWith('id2');
    result.current.setOfferCompleted('id3');
    expect(SocketService.__mocks.setOfferCompleted).toHaveBeenCalledWith('id3');
    result.current.isConnected();
    expect(SocketService.__mocks.isConnected).toHaveBeenCalled();
  });
});
