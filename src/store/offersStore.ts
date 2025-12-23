import { create } from 'zustand';

import type { Offer } from '@/shared/types/offer';
import type { ConnectionStatus } from '@/shared/services/socket/socketEvents';

interface OfferMetrics {
  totalOffers: number;
  avgPrice: number;
}

export interface OffersState {
  offers: Offer[];
  connectionStatus: ConnectionStatus;
  metrics: OfferMetrics | null;

  setOffers: (offers: Offer[]) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (offer: Offer) => void;
  removeOffer: (offerId: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setMetrics: (metrics: OfferMetrics) => void;
  clearOffers: () => void;
  getOfferById: (id: string) => Offer | undefined;
}

export const useOffersStore = create<OffersState>((set, get) => ({
  offers: [],
  connectionStatus: 'disconnected',
  metrics: null,
  setOffers: (offers) => set({ offers }),

  addOffer: (offer) =>
    set((state) => ({
      offers: [...state.offers, offer],
    })),

  updateOffer: (updatedOffer) =>
    set((state) => ({
      offers: state.offers.map((offer) => (offer.id === updatedOffer.id ? updatedOffer : offer)),
    })),

  removeOffer: (offerId) =>
    set((state) => ({
      offers: state.offers.filter((offer) => offer.id !== offerId),
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setMetrics: (metrics) => set({ metrics }),

  clearOffers: () => set({ offers: [], metrics: null }),

  getOfferById: (id: string) => get().offers.find((offer) => offer.id === id),
}));
