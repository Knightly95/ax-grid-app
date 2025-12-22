import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const getQuantityInput = () => screen.getByPlaceholderText(/Min:/i);
export const getSubmitButton = () => screen.getByRole('button', { name: /submit/i });

export async function fillAndSubmitForm(quantity: string) {
  const user = userEvent.setup();
  const quantityInput = getQuantityInput();
  const submitButton = getSubmitButton();

  await user.type(quantityInput, quantity);
  await user.click(submitButton);

  return user;
}

export function expectModalToDisplay(vendor: string, sourceType: string) {
  expect(screen.getByText(vendor)).toBeInTheDocument();
  expect(screen.getByText(`${sourceType} Energy`)).toBeInTheDocument();
}
