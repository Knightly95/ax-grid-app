import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { getStatusColor } from './status-helpers';

interface StatusChipProps {
  status: string;
  size?: ChipProps['size'];
}

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const color = getStatusColor(status);
  return <Chip label={status} color={color} size={size} />;
}
