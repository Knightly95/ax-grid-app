import type { Offering } from '@/shared/types/offering';

export function convertOfferingToFormValues(offering: Offering): Record<string, string | string[]> {
  return {
    vendor: offering.vendor,
    ...(offering.price !== undefined && { price: offering.price.toString() }),
    ...(offering.minQuantity !== undefined && { minQuantity: offering.minQuantity.toString() }),
    ...(offering.contractTerms && { contractTerms: offering.contractTerms }),
    ...(offering.paymentTerms && { paymentTerms: offering.paymentTerms }),
    ...Object.fromEntries(
      Object.entries(offering)
        .filter(
          ([key]) =>
            ![
              'id',
              'sourceType',
              'vendor',
              'createdAt',
              'updatedAt',
              'price',
              'minQuantity',
              'contractTerms',
              'paymentTerms',
            ].includes(key),
        )
        .map(([key, value]) => [key, typeof value === 'number' ? value.toString() : value]),
    ),
  };
}
