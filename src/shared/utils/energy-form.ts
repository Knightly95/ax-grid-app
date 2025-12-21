import type { EnergyOfferingsConfig, FormField } from '@/shared/types/form-config';

export function getEnergyFormFields(config: EnergyOfferingsConfig | undefined, sourceType: string) {
  if (!config) {
    return {
      fields: [],
      displayUnits: true,
      sourceLabel: undefined,
    };
  }

  const sourceConfig = config.sources[sourceType];
  if (!sourceConfig) {
    return {
      fields: [],
      displayUnits: true,
      sourceLabel: undefined,
    };
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

  const fields = [...config.common, ...orderedFields, ...remainingFields];

  return {
    fields,
    displayUnits: config.uiHints.displayUnits ?? true,
    sourceLabel: config.sources[sourceType]?.label,
  };
}
