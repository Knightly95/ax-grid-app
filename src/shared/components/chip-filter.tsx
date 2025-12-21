import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface ChipFilterProps<T extends string | number> {
  label: string;
  options: readonly T[];
  selectedValues: T[];
  onToggle: (value: T) => void;
  onClearAll: () => void;
}

export function ChipFilter<T extends string | number>({
  label,
  options,
  selectedValues,
  onToggle,
  onClearAll,
}: ChipFilterProps<T>): React.ReactElement {
  return (
    <Box sx={{ mb: 2, px: 2, pt: 2, pb: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}:
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            onClick={() => onToggle(option)}
            color={selectedValues.includes(option) ? 'primary' : 'default'}
            variant={selectedValues.includes(option) ? 'filled' : 'outlined'}
          />
        ))}
        {selectedValues.length > 0 && (
          <Chip label="Clear All" onClick={onClearAll} color="secondary" variant="outlined" />
        )}
      </Box>
    </Box>
  );
}
