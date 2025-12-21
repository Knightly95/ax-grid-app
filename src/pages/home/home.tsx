import { Container, Typography, Box, Paper } from '@mui/material';

import { useOffersStore } from '@/store/offersStore';

export default function Home() {
  const { connectionStatus, metrics, offers } = useOffersStore();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Energy Grid Dashboard
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Connection Status
          </Typography>
          <Typography>
            Status: <strong>{connectionStatus}</strong>
          </Typography>

          {metrics && (
            <>
              <Typography>Total Offers: {metrics.totalOffers}</Typography>
              <Typography>Average Price: €{metrics.avgPrice.toFixed(2)}/MWh</Typography>
            </>
          )}

          <Typography>Live Offers Count: {offers.length}</Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Quick Stats
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>
              Solar Offers: {offers.filter((o) => o.sourceType === 'solar').length}
            </Typography>
            <Typography>
              Gas Offers: {offers.filter((o) => o.sourceType === 'gas').length}
            </Typography>
            <Typography>
              Hydro Offers: {offers.filter((o) => o.sourceType === 'hydro').length}
            </Typography>
            <Typography>
              Wind Offers: {offers.filter((o) => o.sourceType === 'wind').length}
            </Typography>
            <Typography>
              Active Offers: {offers.filter((o) => o.status === 'active').length}
            </Typography>
            <Typography>
              Pending Offers: {offers.filter((o) => o.status === 'pending').length}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
