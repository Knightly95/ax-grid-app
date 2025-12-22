import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { AllTheProviders } from './all-the-providers';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

export function renderWithRouter(
  ui: ReactElement,
  { route = '/', ...options }: CustomRenderOptions = {},
) {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { renderWithRouter as render };
