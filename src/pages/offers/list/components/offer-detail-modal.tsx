import { Box, Typography, Button } from '@mui/material';

import type { Offer } from '@/shared/types/offer';
import { Modal } from '@/shared/components/modal';
import { StatusChip } from '../utils/status';
import { formatCurrency } from '../utils/formatters';

interface OfferDetailModalProps {
  open: boolean;
  offer: Offer | null;
  onClose: () => void;
  onComplete: () => void;
}

export function OfferDetailModal({ open, offer, onClose, onComplete }: OfferDetailModalProps) {
  if (!offer) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      config={{
        title: 'Offer Details',
        maxWidth: 600,
        showCloseButton: true,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body1">{offer.id}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Source Type
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {offer.sourceType}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Price
              </Typography>
              <Typography variant="body1">{formatCurrency(offer.price)}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Quantity
              </Typography>
              <Typography variant="body1">
                {offer.quantity} {offer.unit}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <StatusChip status={offer.status} />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Vendor
              </Typography>
              <Typography variant="body1">{offer.vendor}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">{offer.location}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">
                {new Date(offer.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Updated
              </Typography>
              <Typography variant="body1">
                {new Date(offer.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          {offer.status !== 'completed' && (
            <Button variant="contained" color="primary" onClick={onComplete}>
              Confirm Offer
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
