vi.mock('@/shared/hooks/useSocket', () => ({
  useSocket: () => {},
}));
vi.mock('@/store/offersStore');
vi.mock('@/shared/services/socket/socketService', () => {
  const mockSocketService = { setOfferCompleted: vi.fn() };
  return { socketService: mockSocketService };
});

import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/testing/test-utils';
import { useOffersStore } from '@/store/offersStore';
import OfferList from '../offer-list';
import {
  getMockOffers,
  mockWindOffer,
  openRowActionsMenuByVendor,
  clickMenuItem,
} from './test-helpers';
import * as socketServiceModule from '@/shared/services/socket/socketService';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: unknown) => node,
  };
});
import type { Offer } from '@/shared/types/offer';

describe('OfferList - Integration Tests', () => {
  let offersStoreMock: {
    offers: Offer[];
    removeOffer: Mock;
    getOfferById: Mock;
  };
  let socketServiceMock: { setOfferCompleted: Mock };
  beforeEach(() => {
    offersStoreMock = {
      offers: getMockOffers(),
      removeOffer: vi.fn(),
      getOfferById: vi.fn((id: string) => getMockOffers().find((o) => o.id === id)),
    };
    (useOffersStore as unknown as Mock).mockImplementation(
      (selector: (state: typeof offersStoreMock) => unknown) => selector(offersStoreMock),
    );
    socketServiceMock = (
      socketServiceModule as unknown as { socketService: { setOfferCompleted: Mock } }
    ).socketService;
    socketServiceMock.setOfferCompleted.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the empty state when there are no offers', () => {
    offersStoreMock.offers = [];
    (useOffersStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => selector(offersStoreMock),
    );
    render(<OfferList />);
    expect(screen.getByText(/No energy offers available/i)).toBeInTheDocument();
  });

  it('should render all offer rows', () => {
    render(<OfferList />);
    expect(screen.getByText(/EcoEnergy Ltd/i)).toBeInTheDocument();
    expect(screen.getByText(/WindPower Inc/i)).toBeInTheDocument();
  });

  it('should filter offers by source type', async () => {
    render(<OfferList />);
    const solarChip = screen.getByRole('button', { name: /solar/i });
    await userEvent.click(solarChip);
    expect(screen.getByText(/EcoEnergy Ltd/i)).toBeInTheDocument();
    expect(screen.queryByText(/WindPower Inc/i)).not.toBeInTheDocument();
  });

  it('should clear all filters', async () => {
    render(<OfferList />);
    const solarChip = screen.getByRole('button', { name: /solar/i });
    await userEvent.click(solarChip);
    const clearAll = screen.getByRole('button', { name: /clear all/i });
    await userEvent.click(clearAll);
    expect(screen.getByText(/EcoEnergy Ltd/i)).toBeInTheDocument();
    expect(screen.getByText(/WindPower Inc/i)).toBeInTheDocument();
  });

  it('should open and close the offer detail modal', async () => {
    render(<OfferList />);
    await openRowActionsMenuByVendor('EcoEnergy Ltd');
    await clickMenuItem(/view details/i);
    const dialog = await screen.findByRole('presentation');
    const { getByText, getByLabelText } = within(dialog);
    expect(getByText(/offer details/i)).toBeInTheDocument();
    expect(getByText('EcoEnergy Ltd')).toBeInTheDocument();
    const closeBtn = getByLabelText(/close modal/i);
    await userEvent.click(closeBtn);
    expect(screen.queryByText(/offer details/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/close modal/i)).not.toBeInTheDocument();
  });

  it('should call setOfferCompleted when confirming an offer', async () => {
    render(<OfferList />);
    await openRowActionsMenuByVendor('WindPower Inc');
    await clickMenuItem(/confirm/i);
    expect(socketServiceMock.setOfferCompleted).toHaveBeenCalledWith(mockWindOffer.id);
  });
});
