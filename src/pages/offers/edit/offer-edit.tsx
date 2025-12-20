import { useParams, useNavigate } from 'react-router-dom';
import { useOffersStore } from '@/store/offersStore';
import type { Offer } from '@/shared/models/offer';

export default function OfferEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const offer = useOffersStore((state): Offer | undefined => state.getOfferById(id ?? ''));

  const handleBack = () => {
    void navigate('/offers');
  };

  return (
    <div className="offer-list">
      <h1>Edit Offer</h1>
      {offer ? <p>ID: {offer.id}</p> : <p>offer not found</p>}
      <button onClick={handleBack}>Back to Offers</button>
    </div>
  );
}
