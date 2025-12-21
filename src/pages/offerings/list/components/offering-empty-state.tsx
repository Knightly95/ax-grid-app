import { Box, Typography, Button, alpha } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import {
  OFFERING_EMPTY_STATE_TITLE,
  OFFERING_EMPTY_STATE_MESSAGE,
  OFFERING_CREATE_BUTTON_TEXT,
} from '../constants/text';

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
        {OFFERING_EMPTY_STATE_TITLE}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {OFFERING_EMPTY_STATE_MESSAGE}
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateClick}>
        {OFFERING_CREATE_BUTTON_TEXT}
      </Button>
    </Box>
  );
}
