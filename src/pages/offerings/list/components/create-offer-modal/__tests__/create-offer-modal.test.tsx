import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { REDIRECT_DELAY_MS } from '@/pages/offerings/list/constants/modal';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/testing/test-utils';

import type { Offer } from '@/shared/types/offer';
import { CreateOfferModal } from '../index';
import {
  mockSolarOffering,
  mockWindOffering,
  mockGasOffering,
  mockHydroOffering,
  mockGasOfferingWithoutLocation,
} from '../../../../../../testing/offering-fixtures';
import { fillAndSubmitForm, getQuantityInput, expectModalToDisplay } from './test-helpers';
import type { Mock } from 'vitest';

const mockNavigate = vi.fn();
interface OffersStoreMock {
  addOffer: Mock<(offer: Offer) => void>;
}
const offersStoreMock: OffersStoreMock = { addOffer: vi.fn() };

vi.mock('@/store/offersStore', async () => {
  const actual = await vi.importActual<typeof import('@/store/offersStore')>('@/store/offersStore');
  return {
    ...actual,
    useOffersStore: function <T = OffersStoreMock>(
      selector?: (state: OffersStoreMock) => T,
    ): T | OffersStoreMock {
      return selector ? selector(offersStoreMock) : offersStoreMock;
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateOfferModal - Integration Tests', () => {
  let mockOnClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClose = vi.fn();
    vi.clearAllMocks();
    offersStoreMock.addOffer = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Modal Display & Content', () => {
    it('should render modal with offering details when open', () => {
      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);

      expect(screen.getByText(/SolarCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/Solar Energy/i)).toBeInTheDocument();

      expect(screen.getByText(/Price/i)).toBeInTheDocument();
      expect(screen.getByText(/€50.00\/MWh/i)).toBeInTheDocument();
      expect(screen.getByText(/Capacity/i)).toBeInTheDocument();
      expect(screen.getByText(/500 MW/i)).toBeInTheDocument();
      expect(screen.getByText(/Location/i)).toBeInTheDocument();
      expect(screen.getByText(/California/i)).toBeInTheDocument();

      expect(screen.getByText(/Place Order/i)).toBeInTheDocument();
      expect(screen.getByText(/Minimum order quantity: 100 MWh/i)).toBeInTheDocument();
    });

    it('should not render when modal is closed', () => {
      render(<CreateOfferModal offering={mockSolarOffering} open={false} onClose={mockOnClose} />);

      expect(screen.queryByText(/SolarCorp/i)).not.toBeInTheDocument();
    });

    it('should not render when offering is null', () => {
      render(<CreateOfferModal offering={null} open={true} onClose={mockOnClose} />);

      expect(screen.queryByText(/Place Order/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should display quantity input with correct placeholder', () => {
      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);

      const quantityInput = getQuantityInput();
      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveAttribute('type', 'number');
    });
  });

  describe('Order Submission Flow', () => {
    it('should create offer and redirect on successful submission', async () => {
      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);
      await fillAndSubmitForm('250');

      expect(offersStoreMock.addOffer).toHaveBeenCalledTimes(1);
      const createdOffer = offersStoreMock.addOffer.mock.calls[0][0];

      expect(createdOffer).toMatchObject({
        sourceType: 'solar',
        price: 50,
        quantity: 250,
        unit: 'MWh',
        status: 'pending',
        vendor: 'SolarCorp',
        location: 'California',
      });

      expect(createdOffer.id).toBeDefined();
      expect(createdOffer.createdAt).toBeDefined();
      expect(createdOffer.updatedAt).toBeDefined();
    });

    it('should show success message after submission', async () => {
      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);
      await fillAndSubmitForm('150');

      expect(
        screen.getByText(/Order created successfully! Redirecting to offers page.../i),
      ).toBeInTheDocument();
    });

    it('should close modal and navigate to offers page after delay', async () => {
      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);
      await fillAndSubmitForm('200');
      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1);
          expect(mockNavigate).toHaveBeenCalledWith('/offers');
        },
        { timeout: REDIRECT_DELAY_MS + 500 },
      );
    });
  });

  describe('Different Source Types', () => {
    it('should handle wind offering correctly', () => {
      render(<CreateOfferModal offering={mockWindOffering} open={true} onClose={mockOnClose} />);

      expectModalToDisplay('WindPower Inc', 'Wind');
    });

    it('should handle gas offering correctly', () => {
      render(<CreateOfferModal offering={mockGasOffering} open={true} onClose={mockOnClose} />);

      expectModalToDisplay('GasCorp', 'Gas');
    });
  });

  describe('Edge Cases', () => {
    it('should handle offering without optional fields', async () => {
      render(<CreateOfferModal offering={mockHydroOffering} open={true} onClose={mockOnClose} />);
      await fillAndSubmitForm('100');

      expect(offersStoreMock.addOffer).toHaveBeenCalled();
      const createdOffer: Offer = offersStoreMock.addOffer.mock.calls[0][0];
      expect(createdOffer.price).toBe(0);
    });

    it('should handle gas offering without location field', async () => {
      render(
        <CreateOfferModal
          offering={mockGasOfferingWithoutLocation}
          open={true}
          onClose={mockOnClose}
        />,
      );
      await fillAndSubmitForm('75');

      expect(offersStoreMock.addOffer).toHaveBeenCalled();
      const createdOffer = offersStoreMock.addOffer.mock.calls[0][0];
      expect(createdOffer.location).toBe('N/A');
    });
  });

  describe('User Interactions', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();

      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText(/close/i);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should allow user to type and clear quantity', async () => {
      const user = userEvent.setup();

      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);

      const quantityInput = getQuantityInput();

      await user.type(quantityInput, '300');
      expect(quantityInput).toHaveValue(300);

      await user.clear(quantityInput);
      expect(quantityInput).toHaveValue(null);
    });

    it('should allow user to enter quantity and submit form', async () => {
      const user = userEvent.setup();

      render(<CreateOfferModal offering={mockSolarOffering} open={true} onClose={mockOnClose} />);

      const quantityInput = getQuantityInput();
      await user.type(quantityInput, '175');
      expect(quantityInput).toHaveValue(175);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(offersStoreMock.addOffer).toHaveBeenCalledTimes(1);
      expect(offersStoreMock.addOffer.mock.calls[0][0].quantity).toBe(175);
    });
  });
});
