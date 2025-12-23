import * as stringUtils from '../string';

describe('string utils', () => {
  it('should capitalize string', () => {
    expect(stringUtils.capitalize('test')).toBe('Test');
  });

  it('should handle empty string', () => {
    expect(stringUtils.capitalize('')).toBe('');
  });

  it('should not change already capitalized', () => {
    expect(stringUtils.capitalize('Test')).toBe('Test');
  });

  it('should capitalize single character', () => {
    expect(stringUtils.capitalize('a')).toBe('A');
  });
});
