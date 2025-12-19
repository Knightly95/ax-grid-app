import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import Home from './pages/home/home';
import DealList from './pages/deal-list/deal-list';
import PageNavbar from '@/shared/components/page-navbar';
import './App.css';

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
            <Route path="/deals" element={<DealList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
