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
import { sourceIcons, sourceColors } from './offering-constants';

interface OfferingCardProps {
  offering: Offering;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function OfferingCard({ offering, onEdit, onDelete }: OfferingCardProps) {
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
    alert(`Buy offering: ${offering.vendor} - ${offering.sourceType}`);
    // TODO: Implement buy functionality
  };

  const formatPrice = (price?: number) => {
    return price ? `€${Number(price).toFixed(2)}/MWh` : 'N/A';
  };

  const getCapacity = (offering: Offering): string => {
    if ('capacity' in offering && offering.capacity) {
      const unit = offering.sourceType === 'kinetic' ? 'kW' : 'MW';
      return `${offering.capacity} ${unit}`;
    }
    return 'N/A';
  };

  const getLocation = (offering: Offering): string => {
    if ('location' in offering && offering.location) {
      return offering.location;
    }
    return 'Not specified';
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
            {offering.sourceType.charAt(0).toUpperCase() + offering.sourceType.slice(1)}
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
          Create Offer
        </Button>
      </CardContent>
    </Card>
  );
}
