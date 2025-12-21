import { Box, Typography } from '@mui/material';

import type { SourceType } from '@/shared/types/offering';
import { capitalizeFirstLetter } from '@/shared/utils/string';

interface CreateOfferModalHeaderProps {
  vendor: string;
  sourceType: SourceType;
  sourceIcon: React.ReactNode;
  sourceColor: string;
}

export function CreateOfferModalHeader({
  vendor,
  sourceType,
  sourceIcon,
  sourceColor,
}: CreateOfferModalHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: sourceColor,
        color: 'white',
        borderRadius: 1,
        mx: -3,
        mt: -3,
      }}
    >
      <Box sx={{ fontSize: '2rem' }}>{sourceIcon}</Box>
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {vendor}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {capitalizeFirstLetter(sourceType)} Energy
        </Typography>
      </Box>
    </Box>
  );
}
