import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface OfferingHeaderProps {
  onCreateClick: () => void;
}

export function OfferingHeader({ onCreateClick }: OfferingHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={600}>
        Energy Offerings
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateClick}
        sx={{ borderRadius: 2 }}
      >
        Create Offering
      </Button>
    </Box>
  );
}
