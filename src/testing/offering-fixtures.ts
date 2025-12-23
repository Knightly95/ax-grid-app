import type {
  BaseOffering,
  SolarFields,
  WindFields,
  GasFields,
  HydroFields,
} from '@/shared/types/offering';

export const mockSolarOffering: BaseOffering & { sourceType: 'solar' } & SolarFields = {
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

export const mockWindOffering: BaseOffering & { sourceType: 'wind' } & WindFields = {
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

export const mockGasOffering: BaseOffering & { sourceType: 'gas' } & GasFields = {
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

export const mockHydroOffering: BaseOffering & { sourceType: 'hydro' } & HydroFields = {
  id: 'minimal-1',
  sourceType: 'hydro',
  vendor: 'HydroPower',
  capacity: 300,
  waterFlowRate: 1500,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockGasOfferingWithoutLocation: BaseOffering & { sourceType: 'gas' } & GasFields = {
  id: 'no-location-1',
  sourceType: 'gas',
  vendor: 'GasCorp',
  capacity: 800,
  deliveryMethod: 'Tanker',
  flexibility: 'Medium',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const mockEnergyOfferings: Record<string, unknown> = {
  common: [
    {
      key: 'price',
      label: 'Price per Unit',
      type: 'number',
      unit: 'EUR/MWh',
      required: false,
      placeholder: 'e.g., 75',
    },
    {
      key: 'minQuantity',
      label: 'Minimum Purchase Quantity',
      type: 'number',
      unit: 'MWh',
      required: false,
      placeholder: 'e.g., 10',
    },
    {
      key: 'contractTerms',
      label: 'Contract Terms',
      type: 'select',
      options: [
        {
          value: 'spot',
          label: 'Spot (Day-Ahead)',
        },
        {
          value: 'monthly',
          label: 'Monthly',
        },
        {
          value: 'quarterly',
          label: 'Quarterly',
        },
      ],
      required: false,
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        {
          value: 'net15',
          label: 'Net 15',
        },
        {
          value: 'net30',
          label: 'Net 30',
        },
        {
          value: 'prepaid',
          label: 'Prepaid',
        },
      ],
      required: false,
    },
  ],
  sources: {
    solar: {
      label: 'Solar',
      fields: [
        {
          key: 'capacity',
          label: 'Capacity',
          type: 'number',
          unit: 'MW',
          required: true,
        },
        {
          key: 'location',
          label: 'Location',
          type: 'text',
          placeholder: 'e.g., Seville, ES',
          required: true,
        },
        {
          key: 'outputPrediction',
          label: 'Energy Output Prediction',
          type: 'number',
          unit: 'MWh/day',
          required: false,
        },
        {
          key: 'availabilityWindow',
          label: 'Time of Availability',
          type: 'select',
          options: [
            {
              value: 'daylight',
              label: 'Daylight Hours',
            },
            {
              value: 'peak',
              label: 'Peak (10:00–16:00)',
            },
          ],
          required: false,
        },
        {
          key: 'certifications',
          label: 'Certifications',
          type: 'checkbox-group',
          options: [
            {
              value: 'rec',
              label: 'REC',
            },
            {
              value: 'go',
              label: 'Guarantee of Origin',
            },
          ],
          required: false,
        },
      ],
    },
  },
  uiHints: {
    order: ['price', 'minQuantity', 'contractTerms', 'paymentTerms', 'capacity'],
    displayUnits: true,
  },
};
