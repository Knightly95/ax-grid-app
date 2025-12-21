export function formatPrice(price: number | undefined): string {
  return price ? `€${Number(price).toFixed(2)}/MWh` : 'N/A';
}
