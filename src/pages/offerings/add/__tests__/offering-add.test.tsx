import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/testing/test-utils';
import { useOfferingsStore } from '@/store/offeringsStore';
import OfferingAdd from '../offering-add';
import { mockSolarOffering, mockEnergyOfferings } from '@/testing/offering-fixtures';
import { fillSolarOfferingForm } from './test-helpers';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: unknown) => node,
  };
});

vi.mock('@/store/offeringsStore');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let mockIsLoading = false;
let mockError: unknown = null;
let mockConfig: Record<string, unknown> = mockEnergyOfferings;
vi.mock('@/shared/services/energy-offerings', () => ({
  useEnergyOfferings: () => ({
    data: mockConfig,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}));

type OfferingsStoreMock = {
  addOffering: Mock;
};

describe('OfferingAdd - Integration Tests', () => {
  let offeringsStoreMock: OfferingsStoreMock;

  beforeEach(() => {
    offeringsStoreMock = {
      addOffering: vi.fn(),
    };
    (useOfferingsStore as unknown as Mock).mockImplementation(
      (selector: (state: OfferingsStoreMock) => unknown) => selector(offeringsStoreMock),
    );
    mockIsLoading = false;
    mockError = null;
    mockConfig = mockEnergyOfferings;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the add form and allow vendor/source selection', async () => {
    render(<OfferingAdd />);
    expect(screen.getByText(/Create New Offering/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vendor name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/energy source type/i)).toBeInTheDocument();
  });

  it('should show loading when isLoading is true', () => {
    mockIsLoading = true;
    render(<OfferingAdd />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error message if error is present', () => {
    mockError = 'error';
    render(<OfferingAdd />);
    expect(screen.getByText(/Failed to load form configuration/i)).toBeInTheDocument();
  });

  it('should show validation error if vendor or source not selected', async () => {
    render(<OfferingAdd />);
    expect(screen.queryByText(/offering details/i)).not.toBeInTheDocument();
  });

  it('should call addOffering and navigate on valid submit', async () => {
    render(<OfferingAdd />);
    await fillSolarOfferingForm(mockSolarOffering);
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitBtn);
    expect(offeringsStoreMock.addOffering).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/offerings');
  });

  it('should navigate back when clicking cancel', async () => {
    render(<OfferingAdd />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/offerings');
  });
});
