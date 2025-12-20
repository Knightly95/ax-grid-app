import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import Home from "./pages/home/home";
import OfferList from "./pages/offers/list/offer-list";
import OfferAdd from "./pages/offers/add/offer-add";
import OfferEdit from "./pages/offers/edit/offer-edit";
import PageNavbar from "@/shared/components/page-navbar";
import "./App.css";

function App() {
  // Initialize WebSocket connection
  useSocket();

  return (
    <BrowserRouter>
      <div className="app">
        <PageNavbar></PageNavbar>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/offers" element={<OfferList />} />
            <Route path="/offers/add/:id" element={<OfferAdd />} />
            <Route path="/offers/edit/:id" element={<OfferEdit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
