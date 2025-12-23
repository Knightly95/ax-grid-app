import * as format from '../format';

describe('format utils', () => {
  it('should format price correctly', () => {
    expect(format.formatPrice(123.456)).toBe('€123.46/MWh');
    expect(format.formatPrice(0)).toBe('N/A');
    expect(format.formatPrice(undefined)).toBe('N/A');
  });
});
