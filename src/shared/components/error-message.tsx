import { Typography } from '@mui/material';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Typography color="error" sx={{ mb: 2 }}>
      {message}
    </Typography>
  );
}
