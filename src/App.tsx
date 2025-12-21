import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { PageNavbar } from '@/shared/components/page-navbar';

import Home from './pages/home/home';
import OfferList from './pages/offers/list/offer-list';
import OfferingList from './pages/offerings/list/offering-list';
import OfferingAdd from './pages/offerings/add/offering-add';
import OfferingEdit from './pages/offerings/edit/offering-edit';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="app">
          <PageNavbar></PageNavbar>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/offers" element={<OfferList />} />
              <Route path="/offerings" element={<OfferingList />} />
              <Route path="/offerings/add" element={<OfferingAdd />} />
              <Route path="/offerings/edit/:id" element={<OfferingEdit />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
