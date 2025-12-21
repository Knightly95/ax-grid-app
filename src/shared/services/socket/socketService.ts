import { io, Socket } from 'socket.io-client';

import type { Offer } from '@/shared/types/offer';
import { config } from '@/config';

import type {
  OfferRemovedPayload,
  OpsMetricPayload,
  OfferActionPayload,
  ConnectionStatus,
} from './socketEvents';
import { SOCKET_EVENTS } from './socketEvents';

type EventCallback<T> = (data: T) => void;

class SocketService {
  private socket: Socket | null = null;
  private connectionStatus: ConnectionStatus = 'disconnected';

  connect(): void {
    if (this.socket?.connected) {
      console.warn('Socket already connected');
      return;
    }

    this.connectionStatus = 'connecting';
    this.socket = io(config.socket.url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = 'disconnected';
    }
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.connectionStatus = 'connected';
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus = 'disconnected';
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      this.connectionStatus = 'error';
      console.error('Socket connection error:', error);
    });
  }

  onOffersInit(callback: EventCallback<Offer[]>): void {
    this.socket?.on(SOCKET_EVENTS.OFFERS_INIT, callback);
  }

  onOfferCreated(callback: EventCallback<Offer>): void {
    this.socket?.on(SOCKET_EVENTS.OFFERS_CREATED, callback);
  }

  onOfferUpdated(callback: EventCallback<Offer>): void {
    this.socket?.on(SOCKET_EVENTS.OFFERS_UPDATED, callback);
  }

  onOfferRemoved(callback: EventCallback<OfferRemovedPayload>): void {
    this.socket?.on(SOCKET_EVENTS.OFFERS_REMOVED, callback);
  }

  onOpsMetric(callback: EventCallback<OpsMetricPayload>): void {
    this.socket?.on(SOCKET_EVENTS.OPS_METRIC, callback);
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  requestOffersList(): void {
    if (!this.isConnected()) {
      console.warn('Socket not connected. Cannot request offers list.');
      return;
    }
    this.socket?.emit(SOCKET_EVENTS.OFFERS_LIST);
  }

  setOfferPending(offerId: string): void {
    if (!this.isConnected()) {
      console.warn('Socket not connected. Cannot set offer pending.');
      return;
    }
    const payload: OfferActionPayload = { id: offerId };
    this.socket?.emit(SOCKET_EVENTS.OFFERS_PENDING, payload);
  }

  setOfferProcessing(offerId: string): void {
    if (!this.isConnected()) {
      console.warn('Socket not connected. Cannot set offer processing.');
      return;
    }
    const payload: OfferActionPayload = { id: offerId };
    this.socket?.emit(SOCKET_EVENTS.OFFERS_PROCESSING, payload);
  }

  setOfferCompleted(offerId: string): void {
    if (!this.isConnected()) {
      console.warn('Socket not connected. Cannot set offer completed.');
      return;
    }
    const payload: OfferActionPayload = { id: offerId };
    this.socket?.emit(SOCKET_EVENTS.OFFERS_COMPLETED, payload);
  }
}

export const socketService = new SocketService();
