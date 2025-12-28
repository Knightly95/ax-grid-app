import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { Container, Typography, Box } from '@mui/material';

import type { SourceType } from '@/shared/types/offering';
import type { Offering } from '@/shared/types/offering';
import { useOfferingsStore } from '@/store/offeringsStore';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { Loading } from '@/shared/components/loading';
import { useEnergyOfferings } from '@/shared/services/energy-offerings';
import { getEnergyFormFields } from '@/shared/utils/energy-form';
import { PageHeader, PageActions } from '@/shared/components/page-navigation';
import { ErrorMessage } from '@/shared/components/error-message';
import { SourceTypeSelect } from './components/offering-form-fields';
import type { FormField } from '@/shared/types/form-config';

export default function OfferingAdd() {
  const navigate = useNavigate();
  const addOffering = useOfferingsStore((state) => state.addOffering);
  const { data: config, isLoading, error } = useEnergyOfferings();
  const [selectedSource, setSelectedSource] = useState<SourceType | ''>('');
  const {
    fields: energyFields,
    displayUnits,
    sourceLabel,
  } = getEnergyFormFields(config, selectedSource || 'solar');

  const fields: FormField[] = [
    {
      key: 'vendor',
      label: 'Vendor Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., SolarCorp Inc.',
    },
    ...energyFields,
  ];

  const handleBack = () => {
    void navigate('/offerings');
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = (values: FieldValues) => {
    const newOffering = {
      sourceType: selectedSource,
      ...values,
    } as Omit<Offering, 'id' | 'createdAt' | 'updatedAt'>;

    addOffering(newOffering);
    void navigate('/offerings');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PageHeader buttons={[{ label: '← Back to Offerings', onClick: handleBack }]} />

        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Create New Offering
        </Typography>

        {error ? (
          <ErrorMessage message="Failed to load form configuration. Please try again later." />
        ) : (
          <SourceTypeSelect value={selectedSource} onChange={setSelectedSource} />
        )}

        {selectedSource && fields.length > 0 && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {sourceLabel} Offering Details
            </Typography>
            <DynamicForm fields={fields} onSubmit={handleSubmit} displayUnits={displayUnits} />
          </Box>
        )}

        <PageActions buttons={[{ label: 'Cancel', onClick: handleBack }]} />
      </Box>
    </Container>
  );
}
