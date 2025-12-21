import { useParams, useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { Container, Typography, Button, Box, Chip } from '@mui/material';

import { useOfferingsStore } from '@/store/offeringsStore';
import type { Offering } from '@/shared/types/offering';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { Loading } from '@/shared/components/loading';
import { useEnergyOfferings } from '@/shared/services/energy-offerings';
import { getEnergyFormFields } from '@/shared/utils/energy-form';

export default function OfferingEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const offering = useOfferingsStore((state): Offering | undefined =>
    state.getOfferingById(id ?? ''),
  );
  const updateOffering = useOfferingsStore((state) => state.updateOffering);

  const { data: config, isLoading } = useEnergyOfferings();
  const { fields, displayUnits, sourceLabel } = getEnergyFormFields(
    config,
    offering?.sourceType || 'solar',
  );

  const handleBack = () => {
    void navigate('/offerings');
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = (values: FieldValues) => {
    if (!offering) return;

    const updatedOffering: Offering = {
      ...offering,
      ...values,
      updatedAt: Date.now(),
    } as Offering;

    updateOffering(updatedOffering);
    void navigate('/offerings');
  };

  if (!offering) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1">
            Offering Not Found
          </Typography>
          <Typography color="error">Offering not found</Typography>
          <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
            Back to Offerings
          </Button>
        </Box>
      </Container>
    );
  }

  // Convert offering to form initial values
  const initialValues: Record<string, string | string[]> = {
    vendor: offering.vendor,
    ...(offering.price !== undefined && { price: offering.price.toString() }),
    ...(offering.minQuantity !== undefined && { minQuantity: offering.minQuantity.toString() }),
    ...(offering.contractTerms && { contractTerms: offering.contractTerms }),
    ...(offering.paymentTerms && { paymentTerms: offering.paymentTerms }),
    // Extract source-specific fields dynamically
    ...Object.fromEntries(
      Object.entries(offering)
        .filter(
          ([key]) =>
            ![
              'id',
              'sourceType',
              'vendor',
              'createdAt',
              'updatedAt',
              'price',
              'minQuantity',
              'contractTerms',
              'paymentTerms',
            ].includes(key),
        )
        .map(([key, value]) => [key, typeof value === 'number' ? value.toString() : value]),
    ),
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button variant="text" size="small" onClick={handleBack} sx={{ mb: 2 }}>
          ← Back to Offerings
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4" component="h1">
            Edit Offering
          </Typography>
          <Chip label={sourceLabel} color="primary" />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Offering ID: {offering.id}
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
