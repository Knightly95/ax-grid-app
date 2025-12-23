import type { EnergyOfferingsConfig } from '@/shared/types/form-config';
import * as utils from '../energy-form';
import { mockEnergyOfferings } from '@/testing/offering-fixtures';

describe('energy-form utils', () => {
  it('should return empty fields if config is undefined', () => {
    const result = utils.getEnergyFormFields(undefined, 'solar');
    expect(result.fields).toEqual([]);
    expect(result.displayUnits).toBe(true);
    expect(result.sourceLabel).toBeUndefined();
  });

  it('should return empty fields if sourceType is missing', () => {
    const config = {
      sources: {},
      uiHints: { order: [], displayUnits: true },
      common: [],
    };
    const result = utils.getEnergyFormFields(config as EnergyOfferingsConfig, 'wind');
    expect(result.fields).toEqual([]);
    expect(result.displayUnits).toBe(true);
    expect(result.sourceLabel).toBeUndefined();
  });

  it('should order fields according to uiHints (using mockEnergyOfferings)', () => {
    const { fields, displayUnits, sourceLabel } = utils.getEnergyFormFields(
      mockEnergyOfferings,
      'solar',
    );
    expect(fields.map((f) => f.key)).toEqual([
      'price',
      'minQuantity',
      'contractTerms',
      'paymentTerms',
      'capacity',
      'location',
      'outputPrediction',
      'availabilityWindow',
      'certifications',
    ]);
    expect(displayUnits).toBe(true);
    expect(sourceLabel).toBe('Solar');
  });
});
