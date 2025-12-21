import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  TextField,
} from '@mui/material';
import type { SourceType } from '@/shared/types/offering';
import type { Offering } from '@/shared/types/offering';
import { useOfferingsStore } from '@/store/offeringsStore';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { useEnergyFormConfig } from '@/shared/hooks/useEnergyFormConfig';

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'solar', label: 'Solar' },
  { value: 'gas', label: 'Gas' },
  { value: 'wind', label: 'Wind' },
  { value: 'hydro', label: 'Hydro' },
  { value: 'kinetic', label: 'Kinetic' },
  { value: 'thermal', label: 'Thermal' },
];

export default function OfferingAdd() {
  const navigate = useNavigate();
  const addOffering = useOfferingsStore((state) => state.addOffering);
  const [selectedSource, setSelectedSource] = useState<SourceType | ''>('');
  const [vendor, setVendor] = useState('');

  const { fields, displayUnits, sourceLabel } = useEnergyFormConfig(selectedSource || 'solar');

  const handleBack = () => {
    void navigate('/offerings');
  };

  const handleSubmit = (values: FieldValues) => {
    if (!selectedSource || !vendor) {
      alert('Please select a source type and enter vendor name');
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

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button variant="text" size="small" onClick={handleBack} sx={{ mb: 2 }}>
          ← Back to Offerings
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Offering
        </Typography>

        <TextField
          fullWidth
          required
          label="Vendor Name"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="e.g., SolarCorp Inc."
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth required sx={{ mb: 4 }}>
          <InputLabel id="sourceType-label">Energy Source Type</InputLabel>
          <Select
            labelId="sourceType-label"
            id="sourceType"
            value={selectedSource}
            label="Energy Source Type"
            onChange={(e) => setSelectedSource(e.target.value as SourceType)}
          >
            <MenuItem value="">
              <em>Select energy source...</em>
            </MenuItem>
            {SOURCE_TYPES.map((source) => (
              <MenuItem key={source.value} value={source.value}>
                {source.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSource && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {sourceLabel} Offering Details
            </Typography>
            <DynamicForm fields={fields} onSubmit={handleSubmit} displayUnits={displayUnits} />
          </Box>
        )}

        <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
