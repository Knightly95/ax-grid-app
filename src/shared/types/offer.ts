import type { SourceType } from './offering';

export type OfferStatus = 'pending' | 'processing' | 'active' | 'completed';

export type Unit = 'MWh';

export interface Offer {
  id: string;
  sourceType: SourceType;
  price: number;
  quantity: number;
  unit: Unit;
  status: OfferStatus;
  vendor: string;
  location: string;
  createdAt: number;
  updatedAt: number;
}
