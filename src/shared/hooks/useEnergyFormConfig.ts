import { useMemo } from 'react';

import energyOfferingsConfig from '@/shared/config/energy-offerings.json';
import type { EnergyOfferingsConfig, FormField } from '@/shared/types/form-config';

const config = energyOfferingsConfig as EnergyOfferingsConfig;

export function useEnergyFormConfig(sourceType: string) {
  const fields = useMemo(() => {
    const sourceConfig = config.sources[sourceType];
    if (!sourceConfig) {
      return [];
    }

    const orderedFields: FormField[] = [];
    const remainingFields = [...sourceConfig.fields];
    const fieldMap = new Map(sourceConfig.fields.map((f) => [f.key, f]));

    config.uiHints.order.forEach((key) => {
      const field = fieldMap.get(key);
      if (field) {
        orderedFields.push(field);
        const index = remainingFields.findIndex((f) => f.key === key);
        if (index !== -1) {
          remainingFields.splice(index, 1);
        }
      }
    });

    return [...config.common, ...orderedFields, ...remainingFields];
  }, [sourceType]);

  return {
    fields,
    displayUnits: config.uiHints.displayUnits,
    sourceLabel: config.sources[sourceType]?.label,
  };
}
