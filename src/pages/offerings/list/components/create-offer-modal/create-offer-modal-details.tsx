import { Box, Typography } from '@mui/material';

interface DetailField {
  label: string;
  value: string | number;
}

interface CreateOfferModalDetailsProps {
  details: DetailField[];
}

export function CreateOfferModalDetails({ details }: CreateOfferModalDetailsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {details.map((detail) => (
          <Box key={detail.label}>
            <Typography variant="caption" color="text.secondary" display="block">
              {detail.label}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {detail.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
