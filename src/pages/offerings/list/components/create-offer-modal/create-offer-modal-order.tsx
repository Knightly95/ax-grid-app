import { Box, Typography } from '@mui/material';

import { DynamicForm } from '@/shared/components/dynamic-form';
import type { FormField } from '@/shared/types/form-config';

interface CreateOfferModalOrderProps {
  fields: FormField[];
  minQuantity?: number;
  onSubmit: (values: { quantity: number }) => void;
}

export function CreateOfferModalOrder({
  fields,
  minQuantity,
  onSubmit,
}: CreateOfferModalOrderProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Place Order
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Specify the quantity you wish to order from this offering.
        {minQuantity && ` Minimum order quantity: ${minQuantity} MWh.`}
      </Typography>

      <DynamicForm
        fields={fields}
        onSubmit={(values) => onSubmit(values as { quantity: number })}
        displayUnits={true}
      />
    </Box>
  );
}
