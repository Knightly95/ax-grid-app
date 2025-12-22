import type { Offering } from '@/shared/types/offering';

export const mockSolarOffering: Offering = {
  id: 'offering-1',
  sourceType: 'solar',
  vendor: 'SolarCorp',
  price: 50,
  minQuantity: 100,
  capacity: 500,
  location: 'California',
  outputPrediction: 450,
  availabilityWindow: '2024-01-01 to 2024-12-31',
  certifications: ['ISO 50001', 'REC'],
  contractTerms: '12 months',
  paymentTerms: 'Net 30',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockWindOffering: Offering = {
  id: 'wind-1',
  sourceType: 'wind',
  vendor: 'WindPower Inc',
  capacity: 600,
  location: 'Texas',
  windSpeedPrediction: 15,
  turbineEfficiency: 92,
  availabilityWindow: '2024-01-01 to 2024-12-31',
  certifications: ['ISO 14001'],
  price: 45,
  minQuantity: 75,
  contractTerms: '12 months',
  paymentTerms: 'Net 30',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockGasOffering: Offering = {
  id: 'gas-1',
  sourceType: 'gas',
  vendor: 'GasCorp',
  price: 40,
  minQuantity: 50,
  capacity: 1000,
  deliveryMethod: 'Pipeline',
  flexibility: 'High',
  emissions: 'Low',
  contractLength: '6 months',
  contractTerms: '6 months',
  paymentTerms: 'Net 15',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockHydroOffering: Offering = {
  id: 'minimal-1',
  sourceType: 'hydro',
  vendor: 'HydroPower',
  capacity: 300,
  waterFlowRate: 1500,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockGasOfferingWithoutLocation: Offering = {
  id: 'no-location-1',
  sourceType: 'gas',
  vendor: 'GasCorp',
  capacity: 800,
  deliveryMethod: 'Tanker',
  flexibility: 'Medium',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
