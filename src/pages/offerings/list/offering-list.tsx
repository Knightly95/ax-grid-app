import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';

import { useOfferingsStore } from '@/store/offeringsStore';
import type { Offering } from '@/shared/types/offering';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';

import { OfferingHeader } from './components/offering-header';
import { OfferingEmptyState } from './components/offering-empty-state';
import { OfferingCard } from './components/offering-card';
import { CreateOfferModal } from './components/create-offer-modal';

export default function OfferingList() {
  const offerings = useOfferingsStore((state) => state.offerings);
  const removeOffering = useOfferingsStore((state) => state.removeOffering);
  const navigate = useNavigate();
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [offeringToDelete, setOfferingToDelete] = useState<string | null>(null);

  const handleCreateClick = () => {
    void navigate('/offerings/add');
  };

  const handleEdit = (id: string) => {
    void navigate(`/offerings/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setOfferingToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (offeringToDelete) {
      removeOffering(offeringToDelete);
    }
    setDeleteConfirmOpen(false);
    setOfferingToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setOfferingToDelete(null);
  };

  const handleViewDetails = (offering: Offering) => {
    setSelectedOffering(offering);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffering(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <OfferingHeader onCreateClick={handleCreateClick} />

        {offerings.length === 0 ? (
          <OfferingEmptyState />
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
                <OfferingCard
                  offering={offering}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              </Box>
            ))}
          </Box>
        )}

        <ConfirmDialog
          open={deleteConfirmOpen}
          title="Delete Offering"
          message="Are you sure you want to delete this offering? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <CreateOfferModal
          offering={selectedOffering}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      </Box>
    </Container>
  );
}
