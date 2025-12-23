import { useParams, useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { Container, Typography, Box, Chip } from '@mui/material';

import { useOfferingsStore } from '@/store/offeringsStore';
import type { Offering } from '@/shared/types/offering';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { Loading } from '@/shared/components/loading';
import { useEnergyOfferings } from '@/shared/services/energy-offerings';
import { getEnergyFormFields } from '@/shared/utils/energy-form';
import { PageHeader, PageActions } from '@/shared/components/page-navigation';
import { convertOfferingToFormValues } from '../utils/form-converters';

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

  if (!offering) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <PageHeader buttons={[{ label: '← Back to Offerings', onClick: handleBack }]} />
          <Typography variant="h4" component="h1" gutterBottom>
            Offering Not Found
          </Typography>
          <PageActions buttons={[{ label: 'Back to Offerings', onClick: handleBack }]} />
        </Box>
      </Container>
    );
  }

  const handleSubmit = (values: FieldValues) => {
    const updatedOffering: Offering = {
      ...offering,
      ...values,
      updatedAt: Date.now(),
    } as Offering;

    updateOffering(updatedOffering);
    void navigate('/offerings');
  };

  const initialValues = convertOfferingToFormValues(offering);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PageHeader buttons={[{ label: '← Back to Offerings', onClick: handleBack }]} />

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

        <PageActions buttons={[{ label: 'Cancel', onClick: handleBack }]} />
      </Box>
    </Container>
  );
}
