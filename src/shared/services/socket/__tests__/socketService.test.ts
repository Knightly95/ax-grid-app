import { vi } from 'vitest';
import { Socket } from 'socket.io-client';
import { socketService } from '../socketService';
import {
  testEmitWithPayload,
  testNoEmitWhenDisconnected,
  testEmitNoPayload,
  testNoEmitNoPayloadWhenDisconnected,
  testOnRegistersCallback,
} from './test-helpers';

vi.mock('socket.io-client', () => {
  return {
    io: vi.fn(() => mockSocket),
    Socket: vi.fn(),
  };
});

const mockSocket = {
  on: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
  connected: false,
  removeAllListeners: vi.fn(),
};

describe('socketService singleton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket.connected = false;
    (socketService as unknown as { socket: Socket | null; connectionStatus: string }).socket = null;
    (
      socketService as unknown as { socket: Socket | null; connectionStatus: string }
    ).connectionStatus = 'disconnected';
  });

  it('connects and sets up listeners', () => {
    socketService.connect();
    expect(socketService.getConnectionStatus()).toBe('connecting');
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
  });

  it('does not reconnect if already connected', () => {
    mockSocket.connected = true;
    (socketService as unknown as { socket: Socket | null }).socket =
      mockSocket as unknown as Socket;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    socketService.connect();
    expect(warnSpy).toHaveBeenCalledWith('Socket already connected');
    warnSpy.mockRestore();
  });

  it('disconnects and resets state', () => {
    (socketService as unknown as { socket: Socket | null }).socket =
      mockSocket as unknown as Socket;
    socketService.disconnect();
    expect(mockSocket.disconnect).toHaveBeenCalled();
    expect(socketService.getConnectionStatus()).toBe('disconnected');
    expect((socketService as unknown as { socket: Socket | null }).socket).toBeNull();
  });

  it('getConnectionStatus returns current status', () => {
    expect(socketService.getConnectionStatus()).toBe('disconnected');
    socketService.connect();
    expect(socketService.getConnectionStatus()).toBe('connecting');
  });

  it('isConnected returns socket connection state', () => {
    expect(socketService.isConnected()).toBe(false);
    (socketService as unknown as { socket: Socket | null }).socket = {
      ...mockSocket,
      connected: true,
    } as unknown as Socket;
    expect(socketService.isConnected()).toBe(true);
  });

  it('removeAllListeners calls socket.removeAllListeners', () => {
    (socketService as unknown as { socket: Socket | null }).socket =
      mockSocket as unknown as Socket;
    socketService.removeAllListeners();
    expect(mockSocket.removeAllListeners).toHaveBeenCalled();
  });

  it('requestOffersList emits OFFERS_LIST when connected', () => {
    testEmitNoPayload({
      method: () => socketService.requestOffersList(),
      event: 'OFFERS_LIST',
      mockSocket,
    });
  });

  it('requestOffersList does not emit if not connected', () => {
    testNoEmitNoPayloadWhenDisconnected({
      method: () => socketService.requestOffersList(),
      warning: 'Socket not connected. Cannot request offers list.',
      mockSocket,
    });
  });

  it('setOfferPending emits OFFERS_PENDING with payload when connected', () => {
    testEmitWithPayload({
      method: socketService.setOfferPending.bind(socketService),
      event: 'OFFERS_PENDING',
      payload: { id: 'pending-id' },
      arg: 'pending-id',
      mockSocket,
    });
  });

  it('setOfferPending does not emit if not connected', () => {
    testNoEmitWhenDisconnected({
      method: socketService.setOfferPending.bind(socketService),
      arg: 'pending-id',
      warning: 'Socket not connected. Cannot set offer pending.',
      mockSocket,
    });
  });

  it('setOfferProcessing emits OFFERS_PROCESSING with payload when connected', () => {
    testEmitWithPayload({
      method: socketService.setOfferProcessing.bind(socketService),
      event: 'OFFERS_PROCESSING',
      payload: { id: 'processing-id' },
      arg: 'processing-id',
      mockSocket,
    });
  });

  it('setOfferProcessing does not emit if not connected', () => {
    testNoEmitWhenDisconnected({
      method: socketService.setOfferProcessing.bind(socketService),
      arg: 'processing-id',
      warning: 'Socket not connected. Cannot set offer processing.',
      mockSocket,
    });
  });

  it('setOfferCompleted emits OFFERS_COMPLETED with payload when connected', () => {
    testEmitWithPayload({
      method: socketService.setOfferCompleted.bind(socketService),
      event: 'OFFERS_COMPLETED',
      payload: { id: 'completed-id' },
      arg: 'completed-id',
      mockSocket,
    });
  });

  it('setOfferCompleted does not emit if not connected', () => {
    testNoEmitWhenDisconnected({
      method: socketService.setOfferCompleted.bind(socketService),
      arg: 'completed-id',
      warning: 'Socket not connected. Cannot set offer completed.',
      mockSocket,
    });
  });

  it('onOffersInit registers callback for OFFERS_INIT', () => {
    testOnRegistersCallback({
      method: socketService.onOffersInit.bind(socketService),
      event: 'OFFERS_INIT',
      mockSocket,
    });
  });

  it('onOfferCreated registers callback for OFFERS_CREATED', () => {
    testOnRegistersCallback({
      method: socketService.onOfferCreated.bind(socketService),
      event: 'OFFERS_CREATED',
      mockSocket,
    });
  });

  it('onOfferUpdated registers callback for OFFERS_UPDATED', () => {
    testOnRegistersCallback({
      method: socketService.onOfferUpdated.bind(socketService),
      event: 'OFFERS_UPDATED',
      mockSocket,
    });
  });

  it('onOfferRemoved registers callback for OFFERS_REMOVED', () => {
    testOnRegistersCallback({
      method: socketService.onOfferRemoved.bind(socketService),
      event: 'OFFERS_REMOVED',
      mockSocket,
    });
  });

  it('onOpsMetric registers callback for OPS_METRIC', () => {
    testOnRegistersCallback({
      method: socketService.onOpsMetric.bind(socketService),
      event: 'OPS_METRIC',
      mockSocket,
    });
  });
});
