import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

import { useOffersStore } from '@/store/offersStore';
import { useSocket } from '@/shared/hooks/useSocket';
import type { Offer } from '@/shared/types/offer';
import { DataTable, type RowAction } from '@/shared/components/data-table';
import { ChipFilter } from '@/shared/components/chip-filter';
import { socketService } from '@/shared/services/socket/socketService';
import { OfferDetailModal } from './components/offer-detail-modal';
import { SourceTypeEnum, type SourceType } from '@/shared/types/offering';
import { OFFER_COLUMNS } from './constants/columns';

const SOURCE_TYPE_OPTIONS = Object.values(SourceTypeEnum);

export default function OfferList() {
  useSocket();
  const offers = useOffersStore((state) => state.offers);
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([]);
  const [viewingOffer, setViewingOffer] = useState<Offer | null>(null);
  // const navigate = useNavigate();

  const getRowActions = (offer: Offer): RowAction<Offer>[] => {
    const actions: RowAction<Offer>[] = [
      {
        label: 'View Details',
        onClick: (offer) => {
          setViewingOffer(offer);
        },
      },
      {
        label: 'Edit',
        onClick: (offer) => {
          console.log('Edit offer:', offer);
          // // eslint-disable-next-line @typescript-eslint/no-floating-promises
          // navigate(`/offers/edit/${offer.id}`);
        },
      },
    ];

    if (offer.status !== 'completed') {
      actions.push({
        label: 'Confirm',
        onClick: (offer) => {
          socketService.setOfferCompleted(offer.id);
        },
      });
    }

    return actions;
  };

  const filteredOffers = [
    ...(selectedSources.length === 0
      ? offers
      : offers.filter((offer) => selectedSources.includes(offer.sourceType))),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleSourceToggle = (source: SourceType) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source],
    );
  };

  const handleClearAll = () => {
    setSelectedSources([]);
  };

  const handleCloseModal = () => {
    setViewingOffer(null);
  };

  const handleCompleteOffer = () => {
    if (viewingOffer) {
      socketService.setOfferCompleted(viewingOffer.id);
      setViewingOffer(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          gutterBottom
          data-testid="offer-list-page-heading"
        >
          Energy Offers
        </Typography>

        {offers.length > 0 && (
          <ChipFilter
            label="Filter by Energy Source"
            options={SOURCE_TYPE_OPTIONS}
            selectedValues={selectedSources}
            onToggle={handleSourceToggle}
            onClearAll={handleClearAll}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 240,
          }}
        >
          {offers.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 2,
                maxWidth: 480,
              }}
            >
              <Typography variant="h5" color="textSecondary" gutterBottom>
                No energy offers available
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Please check back later or ensure your data source is connected.
              </Typography>
            </Box>
          ) : (
            <DataTable rows={filteredOffers} columns={OFFER_COLUMNS} actions={getRowActions} />
          )}
        </Box>

        <OfferDetailModal
          open={viewingOffer !== null}
          offer={viewingOffer}
          onClose={handleCloseModal}
          onComplete={handleCompleteOffer}
        />
      </Box>
    </Container>
  );
}
