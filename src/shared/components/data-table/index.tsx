import { useState, type MouseEvent, type ReactNode } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { SxProps, Theme } from '@mui/material/styles';

import { useRowChangeDetection } from './hooks/useRowChangeDetection';
import { dataGridAnimationStyles } from './styles';

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: ReactNode;
  id?: string;
}

export type RowActionsGetter<T> = (row: T) => RowAction<T>[];

export interface DataTableProps<T extends { id: string | number }> {
  rows: T[];
  columns: GridColDef[];
  actions?: RowAction<T>[] | ((row: T) => RowAction<T>[]);
  checkboxSelection?: boolean;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
}

export function DataTable<T extends { id: string | number }>({
  rows,
  columns,
  actions,
  checkboxSelection = false,
  pageSizeOptions = [10, 25, 50, 100],
  sx,
}: DataTableProps<T>) {
  const paginationModel = { page: 0, pageSize: pageSizeOptions[0] };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const { newRows, changedCells } = useRowChangeDetection(rows);

  const handleMenuClick = (event: MouseEvent<HTMLElement>, row: T) => {
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
    renderCell: (params) => {
      const row = params.row as T;
      const rowActions = typeof actions === 'function' ? actions(row) : actions;
      if (!rowActions || rowActions.length === 0) return null;

      return (
        <IconButton onClick={(e) => handleMenuClick(e, row)} size="small">
          <MoreVertIcon />
        </IconButton>
      );
    },
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
          getRowClassName={(params) => (newRows.has(params.id) ? 'row-flash-new' : '')}
          getCellClassName={(params) => {
            const changedFields = changedCells.get(params.id);
            return changedFields && changedFields.has(params.field) ? 'cell-flash-changed' : '';
          }}
          sx={dataGridAnimationStyles}
        />
      </Paper>
      {actions && selectedRow && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {(typeof actions === 'function' ? actions(selectedRow) : actions).map((action) => (
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
