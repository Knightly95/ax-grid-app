import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/testing/test-utils';
import { useOfferingsStore } from '@/store/offeringsStore';
import OfferingEdit from '../offering-edit';
import { mockSolarOffering } from '../../../../testing/offering-fixtures';

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
    useParams: () => ({ id: mockSolarOffering.id }),
    useNavigate: () => mockNavigate,
  };
});

let mockIsLoading = false;
let mockData: unknown = {
  /* minimal config for getEnergyFormFields */
};
vi.mock('@/shared/services/energy-offerings', () => ({
  useEnergyOfferings: () => ({
    data: mockData,
    isLoading: mockIsLoading,
  }),
}));

vi.mock('@/shared/utils/energy-form', () => ({
  getEnergyFormFields: () => ({
    fields: [],
    displayUnits: {},
    sourceLabel: 'Solar',
  }),
}));

vi.mock('../utils/form-converters', () => ({
  convertOfferingToFormValues: (offering: unknown) => offering,
}));

type OfferingsStoreMock = {
  getOfferingById: Mock;
  updateOffering: Mock;
};

describe('OfferingEdit - Integration Tests', () => {
  let offeringsStoreMock: OfferingsStoreMock;

  beforeEach(() => {
    offeringsStoreMock = {
      getOfferingById: vi.fn(() => mockSolarOffering),
      updateOffering: vi.fn(),
    };
    (useOfferingsStore as unknown as Mock).mockImplementation(
      (selector: (state: OfferingsStoreMock) => unknown) => selector(offeringsStoreMock),
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the edit form with offering data', () => {
    render(<OfferingEdit />);
    expect(screen.getByText(/Edit Offering/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockSolarOffering.id, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/Solar/i)).toBeInTheDocument();
  });

  it('should call updateOffering and navigate on submit', async () => {
    render(<OfferingEdit />);
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(offeringsStoreMock.updateOffering).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/offerings');
    });
  });

  it('should navigate back when clicking cancel', async () => {
    render(<OfferingEdit />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/offerings');
  });

  it('should show loading when isLoading is true', () => {
    mockIsLoading = true;
    mockData = undefined;
    render(<OfferingEdit />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
    mockIsLoading = false;
    mockData = {};
  });

  it('should show not found if offering does not exist', () => {
    offeringsStoreMock.getOfferingById.mockReturnValue(undefined);
    render(<OfferingEdit />);
    expect(screen.getByText(/Offering Not Found/i)).toBeInTheDocument();
  });
});
