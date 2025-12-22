import { BrowserRouter } from 'react-router-dom';

export function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
