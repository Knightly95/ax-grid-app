import type { SourceType } from './offering';
import type { OfferUnit } from './unit';

export type OfferStatus = 'pending' | 'processing' | 'active' | 'completed';

export interface Offer {
  id: string;
  sourceType: SourceType;
  price: number;
  quantity: number;
  unit: OfferUnit;
  status: OfferStatus;
  vendor: string;
  location: string;
  createdAt: number;
  updatedAt: number;
}
