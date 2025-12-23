import { Box, Typography, alpha } from '@mui/material';

import { OFFERING_EMPTY_STATE_TITLE, OFFERING_EMPTY_STATE_MESSAGE } from '../constants/text';

export function OfferingEmptyState() {
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
      <Typography variant="body2" color="text.secondary">
        {OFFERING_EMPTY_STATE_MESSAGE}
      </Typography>
    </Box>
  );
}
