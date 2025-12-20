import { useParams, useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { Container, Typography, Button, Box, Chip } from '@mui/material';
import { useOffersStore } from '@/store/offersStore';
import type { Offer } from '@/shared/types/offer';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { useEnergyFormConfig } from '@/shared/hooks/useEnergyFormConfig';

export default function OfferEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const offer = useOffersStore((state): Offer | undefined => state.getOfferById(id ?? ''));

  const { fields, displayUnits, sourceLabel } = useEnergyFormConfig(offer?.sourceType || 'solar');

  const handleBack = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigate('/offers');
  };

  const handleSubmit = (values: FieldValues) => {
    console.log('Form submitted:', { id: offer?.id, ...values });
    // TODO: Integrate with socketService to update offer
  };

  if (!offer) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1">
            Offer Not Found
          </Typography>
          <Typography color="error">Offer not found</Typography>
          <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
            Back to Offers
          </Button>
        </Box>
      </Container>
    );
  }

  // Convert offer to form initial values
  const initialValues: Record<string, string | string[]> = {
    vendor: offer.vendor,
    location: offer.location,
    price: offer.price.toString(),
    quantity: offer.quantity.toString(),
    // Add other fields as needed based on sourceType
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button variant="text" size="small" onClick={handleBack} sx={{ mb: 2 }}>
          ← Back to Offers
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4" component="h1">
            Edit Offer
          </Typography>
          <Chip label={sourceLabel} color="primary" />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Offer ID: {offer.id}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            displayUnits={displayUnits}
            initialValues={initialValues}
          />
        </Box>

        <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
