import React from 'react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import type { FormField } from '@/shared/types/form-config';

interface FieldRendererProps {
  field: FormField;
  control: Control<FieldValues>;
  displayUnits: boolean;
}

interface BaseRendererProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

function NumberFieldRenderer({
  field,
  displayUnits,
  value,
  onChange,
  error,
}: {
  field: Extract<FormField, { type: 'number' }>;
  displayUnits: boolean;
} & BaseRendererProps) {
  const labelText = displayUnits && field.unit ? `${field.label} (${field.unit})` : field.label;

  return (
    <TextField
      fullWidth
      type="number"
      label={labelText}
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      error={!!error}
      helperText={error}
    />
  );
}

function TextFieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: Extract<FormField, { type: 'text' }>;
} & BaseRendererProps) {
  return (
    <TextField
      fullWidth
      label={field.label}
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      error={!!error}
      helperText={error}
    />
  );
}

function SelectFieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: Extract<FormField, { type: 'select' }>;
} & BaseRendererProps) {
  return (
    <FormControl fullWidth required={field.required} error={!!error}>
      <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
      <Select
        labelId={`${field.key}-label`}
        id={field.key}
        value={value as string}
        label={field.label}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>Select...</em>
        </MenuItem>
        {field.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

function RadioFieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: Extract<FormField, { type: 'radio' }>;
} & BaseRendererProps) {
  return (
    <FormControl required={field.required} error={!!error}>
      <FormLabel id={`${field.key}-label`}>{field.label}</FormLabel>
      <RadioGroup
        aria-labelledby={`${field.key}-label`}
        name={field.key}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

function CheckboxGroupFieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: Extract<FormField, { type: 'checkbox-group' }>;
} & BaseRendererProps) {
  const values = Array.isArray(value) ? value : [];

  return (
    <FormControl required={field.required} error={!!error}>
      <FormLabel component="legend">{field.label}</FormLabel>
      <FormGroup>
        {field.options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={values.includes(option.value)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...values, option.value]
                    : values.filter((v) => v !== option.value);
                  onChange(newValues);
                }}
                value={option.value}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

function renderFieldInput(
  field: FormField,
  displayUnits: boolean,
  value: string | string[],
  onChange: (value: string | string[]) => void,
  errorMessage?: string,
): React.ReactElement | null {
  switch (field.type) {
    case 'number':
      return (
        <NumberFieldRenderer
          field={field}
          displayUnits={displayUnits}
          value={value}
          onChange={onChange}
          error={errorMessage}
        />
      );
    case 'text':
      return (
        <TextFieldRenderer field={field} value={value} onChange={onChange} error={errorMessage} />
      );
    case 'select':
      return (
        <SelectFieldRenderer field={field} value={value} onChange={onChange} error={errorMessage} />
      );
    case 'radio':
      return (
        <RadioFieldRenderer field={field} value={value} onChange={onChange} error={errorMessage} />
      );
    case 'checkbox-group':
      return (
        <CheckboxGroupFieldRenderer
          field={field}
          value={value}
          onChange={onChange}
          error={errorMessage}
        />
      );
    default:
      return null;
  }
}

export function FieldRenderer({ field, control, displayUnits }: FieldRendererProps) {
  return (
    <Controller
      name={field.key}
      control={control}
      rules={{ required: field.required }}
      defaultValue={field.type === 'checkbox-group' ? [] : ''}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          {renderFieldInput(
            field,
            displayUnits,
            value as string | string[],
            onChange,
            error?.message,
          )}
        </>
      )}
    />
  );
}
