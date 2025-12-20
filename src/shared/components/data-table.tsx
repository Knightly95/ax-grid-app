import { useState } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { SxProps, Theme } from '@mui/material/styles';

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  id?: string;
}

interface DataTableProps<T extends { id: string | number }> {
  rows: T[];
  columns: GridColDef[];
  actions?: RowAction<T>[];
  checkboxSelection?: boolean;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
}

export default function DataTable<T extends { id: string | number }>({
  rows,
  columns,
  actions,
  checkboxSelection = false,
  pageSizeOptions = [5, 10, 25, 100],
  sx,
}: DataTableProps<T>) {
  const paginationModel = { page: 0, pageSize: pageSizeOptions[0] };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionClick = (action: RowAction<T>) => {
    if (!selectedRow) return;
    action.onClick(selectedRow);
    handleMenuClose();
  };

  const actionsColumn: GridColDef = {
    field: 'actions',
    headerName: 'Actions',
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton onClick={(e) => handleMenuClick(e, params.row as T)} size="small">
        <MoreVertIcon />
      </IconButton>
    ),
  };

  const allColumns = actions && actions.length > 0 ? [actionsColumn, ...columns] : columns;

  return (
    <>
      <Paper sx={{ width: '100%', ...sx }}>
        <DataGrid
          rows={rows}
          columns={allColumns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          sx={{ border: 0 }}
        />
      </Paper>
      {actions && actions.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {actions.map((action) => (
            <MenuItem key={action.id || action.label} onClick={() => handleActionClick(action)}>
              {action.icon && <span style={{ marginRight: 8 }}>{action.icon}</span>}
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
