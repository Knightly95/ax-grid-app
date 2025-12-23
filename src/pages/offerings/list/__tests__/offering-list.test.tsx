import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/testing/test-utils';
import { useOfferingsStore } from '@/store/offeringsStore';
import OfferingList from '../offering-list';
import { mockSolarOffering, mockWindOffering } from '../../../../testing/offering-fixtures';
import { OFFERING_EMPTY_STATE_TITLE, OFFERING_EMPTY_STATE_MESSAGE } from '../constants/text';
import type { Offering } from '@/shared/types/offering';

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

type OfferingsStoreMock = {
  offerings: Offering[];
  removeOffering: Mock;
  getOfferingById: Mock;
};

describe('OfferingList - Integration Tests', () => {
  let offeringsStoreMock: OfferingsStoreMock;

  beforeEach(() => {
    offeringsStoreMock = {
      offerings: [mockSolarOffering, mockWindOffering],
      removeOffering: vi.fn(),
      getOfferingById: vi.fn((id: string) =>
        [mockSolarOffering, mockWindOffering].find((o) => o.id === id),
      ),
    };
    (useOfferingsStore as unknown as Mock).mockImplementation(
      (selector: (state: OfferingsStoreMock) => unknown) => selector(offeringsStoreMock),
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the empty state when there are no offerings', () => {
    offeringsStoreMock.offerings = [];
    (useOfferingsStore as unknown as Mock).mockImplementation(
      (selector: (state: OfferingsStoreMock) => unknown) => selector(offeringsStoreMock),
    );
    render(<OfferingList />);
    expect(screen.getByText(new RegExp(OFFERING_EMPTY_STATE_TITLE, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(OFFERING_EMPTY_STATE_MESSAGE, 'i'))).toBeInTheDocument();
  });

  it('should render all offering cards', () => {
    render(<OfferingList />);
    expect(screen.getByText(/SolarCorp/i)).toBeInTheDocument();
    expect(screen.getByText(/WindPower Inc/i)).toBeInTheDocument();
  });

  it('should navigate to add offering page when clicking create', async () => {
    render(<OfferingList />);
    const createButton = screen.getByRole('button', { name: /create offering/i });
    await userEvent.click(createButton);
    expect(mockNavigate).toHaveBeenCalledWith('/offerings/add');
  });

  it('should navigate to edit offering page when clicking edit', async () => {
    render(<OfferingList />);
    const moreActionsButtons = screen.getAllByLabelText(/more actions/i);
    await userEvent.click(moreActionsButtons[0]);
    await userEvent.click(screen.getByText(/edit/i));
    expect(mockNavigate).toHaveBeenCalledWith(`/offerings/edit/${mockSolarOffering.id}`);
  });

  it('should open and confirm the delete dialog when deleting an offering', async () => {
    render(<OfferingList />);
    const moreActionsButtons = screen.getAllByLabelText(/more actions/i);
    await userEvent.click(moreActionsButtons[0]);
    await userEvent.click(screen.getByText(/delete/i));

    expect(screen.getByText(/delete offering/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /are you sure you want to delete this offering\? this action cannot be undone\./i,
      ),
    ).toBeInTheDocument();

    const deleteButtons = screen.getAllByText(/delete/i);
    const confirmBtn = deleteButtons.find((el) => el.tagName === 'BUTTON');
    expect(confirmBtn).toBeTruthy();
    await userEvent.click(confirmBtn!);
    await screen.findByText(/delete offering/i);

    await waitFor(() => {
      expect(screen.queryByText(/delete offering/i)).not.toBeInTheDocument();
    });

    expect(offeringsStoreMock.removeOffering).toHaveBeenCalledWith(mockSolarOffering.id);
  });

  it('should open and close the modal when viewing details', async () => {
    render(<OfferingList />);
    const createOfferBtn = screen.getAllByTestId('create-offer-btn')[0];
    await userEvent.click(createOfferBtn);

    expect(screen.getByLabelText(/close modal/i)).toBeInTheDocument();
    expect(screen.getByText(/offering detail/i)).toBeInTheDocument();

    const closeBtn = screen.getByLabelText(/close modal/i);
    await userEvent.click(closeBtn);

    expect(screen.queryByLabelText(/close modal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/offering detail/i)).not.toBeInTheDocument();
  });
});
