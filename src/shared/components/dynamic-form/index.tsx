import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
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
    mode: 'onBlur',
  });

  const onFormSubmit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onFormSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          control={control}
          displayUnits={displayUnits}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
