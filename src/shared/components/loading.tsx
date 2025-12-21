import { CircularProgress, Box, Container } from '@mui/material';

export function Loading() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
}
