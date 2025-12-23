import { useEffect } from 'react';

import { socketService } from '@/shared/services/socket/socketService';
import { useOffersStore } from '@/store/offersStore';

export function useSocket() {
  const {
    setOffers,
    addOffer,
    updateOffer,
    removeOffer,
    setConnectionStatus,
    setMetrics,
    clearOffers,
  } = useOffersStore();

  useEffect(() => {
    socketService.connect();
    setConnectionStatus('connecting');

    socketService.onOffersInit((offers) => {
      setOffers(offers);
      setConnectionStatus(socketService.getConnectionStatus());
    });

    socketService.onOfferCreated((offer) => {
      addOffer(offer);
    });

    socketService.onOfferUpdated((offer) => {
      updateOffer(offer);
    });

    socketService.onOfferRemoved(({ id }) => {
      removeOffer(id);
    });

    socketService.onOpsMetric((metrics) => {
      setMetrics(metrics);
    });

    const statusInterval = setInterval(() => {
      setConnectionStatus(socketService.getConnectionStatus());
    }, 2000);

    return () => {
      clearInterval(statusInterval);
      socketService.removeAllListeners();
      socketService.disconnect();
      clearOffers();
      setConnectionStatus('disconnected');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    requestOffersList: () => socketService.requestOffersList(),
    setOfferPending: (id: string) => socketService.setOfferPending(id),
    setOfferProcessing: (id: string) => socketService.setOfferProcessing(id),
    setOfferCompleted: (id: string) => socketService.setOfferCompleted(id),
    isConnected: () => socketService.isConnected(),
  };
}
