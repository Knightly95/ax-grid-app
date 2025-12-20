import type { Offer } from '@/shared/types/offer';

export const SOCKET_EVENTS = {
  OFFERS_INIT: 'offers:init',
  OFFERS_CREATED: 'offers:created',
  OFFERS_UPDATED: 'offers:updated',
  OFFERS_REMOVED: 'offers:removed',
  OPS_METRIC: 'ops:metric',
  OFFERS_LIST: 'offers:list',
  OFFERS_PENDING: 'offers:pending',
  OFFERS_PROCESSING: 'offers:processing',
  OFFERS_COMPLETED: 'offers:completed',
} as const;

export interface OffersInitPayload {
  offers: Offer[];
}

export interface OfferCreatedPayload {
  offer: Offer;
}

export interface OfferUpdatedPayload {
  offer: Offer;
}

export interface OfferRemovedPayload {
  id: string;
}

export interface OpsMetricPayload {
  totalOffers: number;
  avgPrice: number;
}

export interface OfferActionPayload {
  id: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';
