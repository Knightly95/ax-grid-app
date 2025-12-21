import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

import type { Offering } from '@/shared/types/offering';
import { formatPrice } from '@/shared/utils/format';
import { capitalizeFirstLetter } from '@/shared/utils/string';

import { getCapacity, getLocation } from '../utils/offering-details';
import { OFFERING_CREATE_OFFER_BUTTON_TEXT } from '../constants/text';
import { sourceIcons, sourceColors } from '../constants/source-display.tsx';

interface OfferingCardProps {
  offering: Offering;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (offering: Offering) => void;
}

export function OfferingCard({ offering, onEdit, onDelete, onViewDetails }: OfferingCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(offering.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(offering.id);
  };

  const handleCreateOffer = () => {
    onViewDetails(offering);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          bgcolor: sourceColors[offering.sourceType],
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {sourceIcons[offering.sourceType]}
          <Typography variant="h6" fontWeight={600}>
            {capitalizeFirstLetter(offering.sourceType)}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'white' }}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Vendor:</strong> {offering.vendor}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Location:</strong> {getLocation(offering)}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Capacity:</strong> {getCapacity(offering)}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
          {formatPrice(offering.price)}
        </Typography>

        {offering.minQuantity && (
          <Typography variant="caption" color="text.secondary">
            Min. {offering.minQuantity} MWh
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={handleCreateOffer}
          sx={{ mt: 2 }}
        >
          {OFFERING_CREATE_OFFER_BUTTON_TEXT}
        </Button>
      </CardContent>
    </Card>
  );
}
