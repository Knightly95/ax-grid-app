import type { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { useOffersStore } from '@/store/offersStore';
import type { Offer } from '@/shared/models/offer';
import DataTable, { type RowAction } from '@/shared/components/data-table';
import { socketService } from '@/services/socket/socketService';

export default function OfferList() {
  const { offers } = useOffersStore();
  const navigate = useNavigate();

  const rowActions: RowAction<Offer>[] = [
    {
      label: 'Edit',
      onClick: (offer) => {
        void navigate(`/offers/edit/${offer.id}`);
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
    <div>
      <h1>Energy Offers</h1>

      <div className="offer-list">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px',
          }}
        >
          <button onClick={() => void navigate('/offers/add/new')}>Add Offer</button>
        </div>
        <div className="offers-grid">
          {offers.length === 0 ? (
            <p>No offers available. Waiting for data...</p>
          ) : (
            <DataTable rows={offers} columns={columns} actions={rowActions} />
          )}
        </div>
      </div>
    </div>
  );
}
