import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { BaseOffering, SolarFields } from '@/shared/types/offering';

/**
 * Fills out the add offering form for a solar offering.
 */
export async function fillSolarOfferingForm(
  mock: BaseOffering & { sourceType: 'solar' } & SolarFields,
) {
  // Fill vendor
  const vendorInput = screen.getByLabelText(/vendor name/i);
  await userEvent.clear(vendorInput);
  await userEvent.type(vendorInput, mock.vendor);
  // Select source (simulate MUI Select)
  const sourceSelect = screen.getByLabelText(/energy source type/i);
  await userEvent.click(sourceSelect);
  await userEvent.click(screen.getByText(/solar/i));
  // Wait for DynamicForm to appear
  await screen.findByText(/Solar Offering Details/i);
  // Fill all required fields
  await userEvent.type(screen.getByLabelText(/price per unit/i), String(mock.price));
  await userEvent.type(
    screen.getByLabelText(/minimum purchase quantity/i),
    String(mock.minQuantity),
  );
  await userEvent.click(screen.getByLabelText(/contract terms/i));
  await userEvent.click(screen.getByText(/monthly/i));
  await userEvent.click(screen.getByLabelText(/payment terms/i));
  await userEvent.click(screen.getByText(/net 30/i));
  await userEvent.type(screen.getByLabelText(/capacity/i), String(mock.capacity));
  await userEvent.type(screen.getByLabelText(/location/i), mock.location);
  await userEvent.type(
    screen.getByLabelText(/energy output prediction/i),
    String(mock.outputPrediction),
  );
  await userEvent.click(screen.getByLabelText(/time of availability/i));
  await userEvent.click(screen.getByText(/daylight hours/i));
  await userEvent.click(screen.getByLabelText(/rec/i));
}
