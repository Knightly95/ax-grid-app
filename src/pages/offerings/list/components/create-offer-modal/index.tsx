import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Alert } from '@mui/material';

import type { Offering } from '@/shared/types/offering';
import type { Offer } from '@/shared/types/offer';
import { Modal, type ModalConfig } from '@/shared/components/modal';
import type { FormField } from '@/shared/types/form-config';
import { useOffersStore } from '@/store/offersStore';

import { buildDetailFields } from '../../utils/offering-details';
import { DEFAULT_LOCATION, DEFAULT_MIN_QUANTITY, REDIRECT_DELAY_MS } from '../../constants/modal';
import { sourceIcons, sourceColors } from '../../constants/source-display';
import { CreateOfferModalHeader } from './create-offer-modal-header';
import { CreateOfferModalDetails } from './create-offer-modal-details';
import { CreateOfferModalOrder } from './create-offer-modal-order';

interface CreateOfferModalProps {
  offering: Offering | null;
  open: boolean;
  onClose: () => void;
}

export function CreateOfferModal({ offering, open, onClose }: CreateOfferModalProps) {
  const navigate = useNavigate();
  const addOffer = useOffersStore((state) => state.addOffer);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const details = useMemo(() => (offering ? buildDetailFields(offering) : []), [offering]);

  if (!offering) return null;

  const modalConfig: ModalConfig = {
    title: 'Offering Detail',
    maxWidth: 800,
    showCloseButton: true,
    disableBackdropClick: false,
  };

  const quantityFields: FormField[] = [
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'number',
      unit: 'MWh',
      required: true,
      placeholder: `Min: ${offering.minQuantity || DEFAULT_MIN_QUANTITY} MWh`,
    },
  ];

  const handleOrderSubmit = (values: { quantity: number }): void => {
    const offerLocation = 'location' in offering ? offering.location : DEFAULT_LOCATION;

    const now = Date.now();
    const newOffer: Offer = {
      id: `${now}-${Math.random().toString(36).substring(2, 9)}`,
      sourceType: offering.sourceType,
      price: offering.price || 0,
      quantity: Number(values.quantity),
      unit: 'MWh',
      status: 'pending',
      vendor: offering.vendor,
      location: offerLocation,
      createdAt: now,
      updatedAt: now,
    };

    addOffer(newOffer);
    setOrderSuccess(true);

    setTimeout(() => {
      onClose();
      setOrderSuccess(false);
      navigate('/offers');
    }, REDIRECT_DELAY_MS);
  };

  return (
    <Modal open={open} onClose={onClose} config={modalConfig}>
      <Box>
        <CreateOfferModalHeader
          vendor={offering.vendor}
          sourceType={offering.sourceType}
          sourceIcon={sourceIcons[offering.sourceType]}
          sourceColor={sourceColors[offering.sourceType]}
        />

        {orderSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Order created successfully! Redirecting to offers page...
          </Alert>
        )}

        <CreateOfferModalDetails details={details} />

        <Divider sx={{ my: 3 }} />

        <CreateOfferModalOrder
          fields={quantityFields}
          minQuantity={offering.minQuantity}
          onSubmit={handleOrderSubmit}
        />
      </Box>
    </Modal>
  );
}
