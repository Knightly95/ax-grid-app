import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

import { PageNavbar } from '@/shared/components/page-navbar';
import './App.css';

const OfferList = lazy(() => import('./pages/offers/list/offer-list'));
const OfferingList = lazy(() => import('./pages/offerings/list/offering-list'));
const OfferingAdd = lazy(() => import('./pages/offerings/add/offering-add'));
const OfferingEdit = lazy(() => import('./pages/offerings/edit/offering-edit'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function getTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background:
        mode === 'dark'
          ? { default: '#121212', paper: '#1e1e1e' }
          : { default: '#f5f5f5', paper: '#fff' },
    },
  });
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  );
  const theme = getTheme(mode);

  const handleToggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className="app">
            <PageNavbar mode={mode} onToggleMode={handleToggleMode} />
            <main className="main-content">
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                }
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/offerings" replace />} />
                  <Route path="/offers" element={<OfferList />} />
                  <Route path="/offerings">
                    <Route index element={<OfferingList />} />
                    <Route path="add" element={<OfferingAdd />} />
                    <Route path="edit/:id" element={<OfferingEdit />} />
                  </Route>
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
