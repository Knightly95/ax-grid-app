import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

import type { SourceType, SourceTypeOption } from '@/shared/types/offering';
import { SOURCE_TYPE_OPTIONS } from '@/shared/types/offering';

interface VendorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function VendorField({ value, onChange }: VendorFieldProps) {
  return (
    <TextField
      fullWidth
      required
      label="Vendor Name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., SolarCorp Inc."
      sx={{ mb: 3 }}
    />
  );
}

interface SourceTypeSelectProps {
  value: SourceType | '';
  onChange: (value: SourceType) => void;
  disabled?: boolean;
}

export function SourceTypeSelect({ value, onChange, disabled = false }: SourceTypeSelectProps) {
  return (
    <FormControl fullWidth required sx={{ mb: 4 }}>
      <InputLabel id="sourceType-label">Energy Source Type</InputLabel>
      <Select
        labelId="sourceType-label"
        id="sourceType"
        value={value}
        label="Energy Source Type"
        onChange={(e) => onChange(e.target.value as SourceType)}
        disabled={disabled}
      >
        <MenuItem value="">
          <em>Select energy source...</em>
        </MenuItem>
        {SOURCE_TYPE_OPTIONS.map((source: SourceTypeOption) => (
          <MenuItem key={source.value} value={source.value}>
            {source.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
