import type { GridColDef } from '@mui/x-data-grid';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusChip } from '../utils/status';

export const OFFER_COLUMNS: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'sourceType', headerName: 'Source Type', width: 130 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 100,
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 100,
  },
  { field: 'unit', headerName: 'Unit', width: 80 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <StatusChip status={params.value as string} />,
  },
  { field: 'vendor', headerName: 'Vendor', width: 180 },
  { field: 'location', headerName: 'Location', width: 150 },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 150,
    valueGetter: (value) => formatDate(value),
  },
  {
    field: 'updatedAt',
    headerName: 'Updated',
    width: 150,
    valueGetter: (value) => formatDate(value),
  },
];
