export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function formatDate(value: string | Date | null | undefined): string {
  return value ? new Date(value).toLocaleDateString() : '';
}
