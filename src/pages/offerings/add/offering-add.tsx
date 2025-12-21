import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';

import type { SourceType } from '@/shared/types/offering';
import type { Offering } from '@/shared/types/offering';
import { useOfferingsStore } from '@/store/offeringsStore';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { Loading } from '@/shared/components/loading';
import { useEnergyOfferings } from '@/shared/services/energy-offerings';
import { getEnergyFormFields } from '@/shared/utils/energy-form';
import { PageHeader, PageActions } from '@/shared/components/page-navigation';
import { ErrorMessage } from '@/shared/components/error-message';
import { SourceTypeSelect, VendorField } from './components/offering-form-fields';

export default function OfferingAdd() {
  const navigate = useNavigate();
  const addOffering = useOfferingsStore((state) => state.addOffering);
  const [selectedSource, setSelectedSource] = useState<SourceType | ''>('');
  const [vendor, setVendor] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);

  const { data: config, isLoading, error } = useEnergyOfferings();
  const { fields, displayUnits, sourceLabel } = getEnergyFormFields(
    config,
    selectedSource || 'solar',
  );

  const handleBack = () => {
    void navigate('/offerings');
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = (values: FieldValues) => {
    if (!selectedSource || !vendor) {
      setShowValidationError(true);
      return;
    }

    const newOffering = {
      sourceType: selectedSource,
      vendor,
      ...values,
    } as Omit<Offering, 'id' | 'createdAt' | 'updatedAt'>;

    addOffering(newOffering);
    void navigate('/offerings');
  };

  const handleCloseSnackbar = () => {
    setShowValidationError(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <PageHeader buttons={[{ label: '← Back to Offerings', onClick: handleBack }]} />

        <Typography variant="h4" component="h1" gutterBottom>
          Create New Offering
        </Typography>

        {error && <ErrorMessage message="Failed to load form configuration. Please try again." />}

        <VendorField value={vendor} onChange={setVendor} />

        <SourceTypeSelect value={selectedSource} onChange={setSelectedSource} />

        {selectedSource && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {sourceLabel} Offering Details
            </Typography>
            <DynamicForm fields={fields} onSubmit={handleSubmit} displayUnits={displayUnits} />
          </Box>
        )}

        <PageActions buttons={[{ label: 'Cancel', onClick: handleBack }]} />
      </Box>

      <Snackbar
        open={showValidationError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Please select a source type and enter vendor name
        </Alert>
      </Snackbar>
    </Container>
  );
}
