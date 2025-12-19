import { useOffersStore } from '@/store/offersStore';

export default function DealList() {
  const { offers } = useOffersStore();

  return (
    <div>
      <h1>Energy Deals</h1>
      
      <div className="deal-list">
        <p>Total Offers: {offers.length}</p>
        
        {/* Placeholder for your deal list implementation */}
        <div className="deals-grid">
          {offers.length === 0 ? (
            <p>No deals available. Waiting for data...</p>
          ) : (
            <p>{offers.length} deals loaded. Add your grid/table here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
