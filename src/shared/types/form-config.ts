export interface FieldOption {
  value: string;
  label: string;
}

export interface BaseField {
  key: string;
  label: string;
  required: boolean;
  placeholder?: string;
  unit?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
}

export interface TextField extends BaseField {
  type: 'text';
}

export interface SelectField extends BaseField {
  type: 'select';
  options: FieldOption[];
}

export interface RadioField extends BaseField {
  type: 'radio';
  options: FieldOption[];
}

export interface CheckboxGroupField extends BaseField {
  type: 'checkbox-group';
  options: FieldOption[];
}

export type FormField = NumberField | TextField | SelectField | RadioField | CheckboxGroupField;

export interface SourceConfig {
  label: string;
  fields: FormField[];
}

export interface EnergyOfferingsConfig {
  common: FormField[];
  sources: Record<string, SourceConfig>;
  uiHints: {
    order: string[];
    displayUnits: boolean;
  };
}
