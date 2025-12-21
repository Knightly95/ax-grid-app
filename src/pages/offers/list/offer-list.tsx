import type { GridColDef } from '@mui/x-data-grid';
// import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

import { useOffersStore } from '@/store/offersStore';
import { useSocket } from '@/shared/hooks/useSocket';
import type { Offer } from '@/shared/types/offer';
import { DataTable, type RowAction } from '@/shared/components/data-table';
import { socketService } from '@/shared/services/socket/socketService';

export default function OfferList() {
  useSocket();
  const offers = useOffersStore((state) => state.offers);
  // const navigate = useNavigate();

  const rowActions: RowAction<Offer>[] = [
    {
      label: 'Edit',
      onClick: (offer) => {
        console.log('Edit offer:', offer);
        // // eslint-disable-next-line @typescript-eslint/no-floating-promises
        // navigate(`/offers/edit/${offer.id}`);
      },
    },
    {
      label: 'Confirm',
      onClick: (offer) => {
        socketService.setOfferCompleted(offer.id);
      },
    },
  ];

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

        <Box>
          {offers.length === 0 ? (
            <Typography>No offers available. Waiting for data...</Typography>
          ) : (
            <DataTable rows={offers} columns={columns} actions={rowActions} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
