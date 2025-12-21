import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
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

  const filteredOffers =
    selectedSources.length === 0
      ? offers
      : offers.filter((offer) => selectedSources.includes(offer.sourceType));

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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'sourceType', headerName: 'Source Type', width: 130 },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 100,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      width: 100,
    },
    { field: 'unit', headerName: 'Unit', width: 80 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'vendor', headerName: 'Vendor', width: 180 },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : ''),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 150,
      valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : ''),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Energy Offers
        </Typography>

        <ChipFilter
          label="Filter by Energy Source"
          options={SOURCE_TYPE_OPTIONS}
          selectedValues={selectedSources}
          onToggle={handleSourceToggle}
          onClearAll={handleClearAll}
        />

        <Box>
          {offers.length === 0 ? (
            <Typography>No offers available. Waiting for data...</Typography>
          ) : (
            <DataTable rows={filteredOffers} columns={columns} actions={getRowActions} />
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
