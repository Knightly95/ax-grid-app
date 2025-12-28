import { useEffect } from 'react';

import { socketService } from '@/shared/services/socket/socketService';
import { useOffersStore } from '@/store/offersStore';

export function useSocket() {
  const setOffers = useOffersStore((s) => s.setOffers);
  const addOffer = useOffersStore((s) => s.addOffer);
  const updateOffer = useOffersStore((s) => s.updateOffer);
  const removeOffer = useOffersStore((s) => s.removeOffer);
  const setConnectionStatus = useOffersStore((s) => s.setConnectionStatus);
  const setMetrics = useOffersStore((s) => s.setMetrics);
  const clearOffers = useOffersStore((s) => s.clearOffers);

  useEffect(() => {
    socketService.connect();
    setConnectionStatus('connecting');

    // Connection status event listeners
    const handleConnect = () => setConnectionStatus('connected');
    const handleDisconnect = () => setConnectionStatus('disconnected');
    const handleError = () => setConnectionStatus('error');

    // Attach event listeners directly to the socket instance
    const socket = socketService.getSocket();
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleError);
    }

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

    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
      }
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
