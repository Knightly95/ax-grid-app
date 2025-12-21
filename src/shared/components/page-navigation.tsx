import { Button, Box } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface NavigationButton {
  label: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  startIcon?: React.ReactNode;
  id?: string;
}

interface PageHeaderProps {
  buttons: NavigationButton[];
}

export function PageHeader({ buttons }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      {buttons.map((button) => (
        <Button
          key={button.id || button.label}
          variant={button.variant || 'text'}
          color={button.color}
          size="small"
          onClick={button.onClick}
          startIcon={button.startIcon}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  );
}

interface PageActionsProps {
  buttons: NavigationButton[];
}

export function PageActions({ buttons }: PageActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      {buttons.map((button) => (
        <Button
          key={button.id || button.label}
          variant={button.variant || 'outlined'}
          color={button.color}
          onClick={button.onClick}
          startIcon={button.startIcon}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  );
}
