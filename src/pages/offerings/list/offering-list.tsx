import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { useOfferingsStore } from '@/store/offeringsStore';
import { OfferingHeader } from './components/OfferingHeader';
import { OfferingEmptyState } from './components/OfferingEmptyState';
import { OfferingCard } from './components/OfferingCard';

export default function OfferingList() {
  const offerings = useOfferingsStore((state) => state.offerings);
  const removeOffering = useOfferingsStore((state) => state.removeOffering);
  const navigate = useNavigate();

  const handleCreateClick = () => {
    void navigate('/offerings/add');
  };

  const handleEdit = (id: string) => {
    void navigate(`/offerings/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this offering?')) {
      removeOffering(id);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <OfferingHeader onCreateClick={handleCreateClick} />

        {offerings.length === 0 ? (
          <OfferingEmptyState onCreateClick={handleCreateClick} />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {offerings.map((offering) => (
              <Box
                key={offering.id}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.333% - 16px)',
                    lg: 'calc(25% - 18px)',
                  },
                }}
              >
                <OfferingCard offering={offering} onEdit={handleEdit} onDelete={handleDelete} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
