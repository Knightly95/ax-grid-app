import type { OfferingFormData } from '../pages/offering-add.page';

/**
 * Test data fixtures for offerings
 */
export const SOLAR_OFFERING_DATA: OfferingFormData = {
  vendor: 'SolarCorp Inc.',
  sourceType: 'solar',
  price: '50',
  capacity: '100',
  minQuantity: '10',
  maxQuantity: '500',
  location: 'California',
};

export const WIND_OFFERING_DATA: OfferingFormData = {
  vendor: 'WindPower Ltd.',
  sourceType: 'wind',
  price: '45',
  capacity: '200',
  minQuantity: '20',
  maxQuantity: '800',
  location: 'Texas',
};

export const HYDRO_OFFERING_DATA: OfferingFormData = {
  vendor: 'HydroEnergy Corp.',
  sourceType: 'hydro',
  price: '35',
  capacity: '150',
  minQuantity: '15',
  maxQuantity: '600',
  location: 'Oregon',
};
