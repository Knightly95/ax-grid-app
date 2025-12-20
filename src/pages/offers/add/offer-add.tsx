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
} from '@mui/material';
import type { SourceType } from '@/shared/types/offer';
import { DynamicForm } from '@/shared/components/dynamic-form';
import { useEnergyFormConfig } from '@/shared/hooks/useEnergyFormConfig';

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'solar', label: 'Solar' },
  { value: 'gas', label: 'Gas' },
  { value: 'wind', label: 'Wind' },
  { value: 'hydro', label: 'Hydro' },
];

export default function OfferAdd() {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState<SourceType | ''>('');

  const { fields, displayUnits, sourceLabel } = useEnergyFormConfig(selectedSource || 'solar');

  const handleBack = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigate('/offers');
  };

  const handleSubmit = (values: FieldValues) => {
    console.log('Form submitted:', { sourceType: selectedSource, ...values });
    // TODO: Integrate with socketService to create offer
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Offer
        </Typography>

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
              {sourceLabel} Offer Details
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
