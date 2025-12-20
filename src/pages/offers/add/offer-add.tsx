import { useNavigate } from "react-router-dom";

export default function OfferAdd() {
  const navigate = useNavigate();

  const handleBack = () => {
    void navigate("/offers");
  };

  return (
    <div className="offer-list">
      <h1>Add Offer</h1>

      <button onClick={handleBack}>Back to Offers</button>
    </div>
  );
}
