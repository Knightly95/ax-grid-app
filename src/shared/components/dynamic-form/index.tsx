import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { Button } from '@mui/material';

import type { FormField } from '@/shared/types/form-config';
import { FieldRenderer } from './field-renderer';

interface DynamicFormProps {
  fields: FormField[];
  initialValues?: Record<string, string | string[]>;
  onSubmit: (values: FieldValues) => void;
  displayUnits?: boolean;
}

export function DynamicForm({
  fields,
  initialValues = {},
  onSubmit,
  displayUnits = true,
}: DynamicFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  const onFormSubmit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {fields.map((field) => (
        <FieldRenderer
          key={field.key + '-' + field.label}
          field={field}
          control={control}
          displayUnits={displayUnits}
        />
      ))}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
