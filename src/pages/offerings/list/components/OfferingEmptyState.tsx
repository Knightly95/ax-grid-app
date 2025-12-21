import { Box, Typography, Button, alpha } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface OfferingEmptyStateProps {
  onCreateClick: () => void;
}

export function OfferingEmptyState({ onCreateClick }: OfferingEmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No offerings yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start by creating your first energy offering
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateClick}>
        Create Offering
      </Button>
    </Box>
  );
}
