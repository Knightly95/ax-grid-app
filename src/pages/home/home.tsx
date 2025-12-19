import { useOffersStore } from '@/store/offersStore';

export default function Home() {
  const { connectionStatus, metrics, offers } = useOffersStore();

  return (
    <div>
      <h1>Energy Grid Dashboard</h1>
      
      <div className="status-card">
        <h2>Connection Status</h2>
        <p>Status: <strong>{connectionStatus}</strong></p>
        
        {metrics && (
          <>
            <p>Total Offers: {metrics.totalOffers}</p>
            <p>Average Price: €{metrics.avgPrice.toFixed(2)}/MWh</p>
          </>
        )}
        
        <p>Live Offers Count: {offers.length}</p>
      </div>

      <div className="quick-stats">
        <h2>Quick Stats</h2>
        <p>Solar Offers: {offers.filter(o => o.sourceType === 'solar').length}</p>
        <p>Gas Offers: {offers.filter(o => o.sourceType === 'gas').length}</p>
        <p>Hydro Offers: {offers.filter(o => o.sourceType === 'hydro').length}</p>
        <p>Wind Offers: {offers.filter(o => o.sourceType === 'wind').length}</p>
        <p>Active Deals: {offers.filter(o => o.status === 'active').length}</p>
        <p>Pending Deals: {offers.filter(o => o.status === 'pending').length}</p>
      </div>
    </div>
  );
}
