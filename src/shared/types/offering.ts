import { capitalizeFirstLetter } from '@/shared/utils/string';

export const SourceTypeEnum = {
  SOLAR: 'solar',
  GAS: 'gas',
  WIND: 'wind',
  HYDRO: 'hydro',
  KINETIC: 'kinetic',
  THERMAL: 'thermal',
} as const;

export type SourceType = (typeof SourceTypeEnum)[keyof typeof SourceTypeEnum];

export interface SourceTypeOption {
  value: SourceType;
  label: string;
}

export const SOURCE_TYPE_OPTIONS: SourceTypeOption[] = Object.values(SourceTypeEnum).map(
  (value) => ({
    value,
    label: capitalizeFirstLetter(value),
  }),
);

export type Unit = 'MWh' | 'kW' | 'MW';

// Base offering fields (common to all source types)
export interface BaseOffering {
  id: string;
  sourceType: SourceType;
  vendor: string;
  createdAt: number;
  updatedAt: number;

  // Common fields from config
  price?: number;
  minQuantity?: number;
  contractTerms?: string;
  paymentTerms?: string;
}

// Source-specific fields
export interface SolarFields {
  capacity: number;
  location: string;
  outputPrediction?: number;
  availabilityWindow?: string;
  certifications?: string[];
}

export interface GasFields {
  capacity: number;
  deliveryMethod: string;
  flexibility?: string;
  emissions?: string;
  contractLength?: string;
}

export interface WindFields {
  capacity: number;
  location: string;
  windSpeedPrediction?: number;
  turbineEfficiency?: number;
  availabilityWindow?: string;
  certifications?: string[];
}

export interface HydroFields {
  capacity: number;
  waterFlowRate: number;
  reservoirLevel?: number;
  historicalReservoirLevel?: number;
  regulatoryCompliance?: string;
  flexibility?: string;
  energyStorage?: number;
}

export interface KineticFields {
  capacity: number;
  location: string;
  conversionEfficiency?: number;
  predictability?: string;
  kineticSourceType?: string;
}

export interface ThermalFields {
  capacity: number;
  location: string;
  heatSourceStability?: string;
  temperatureGradient?: number;
  conversionEfficiency?: number;
  heatSourceType?: string;
  environmentalCompliance?: string;
}

// Discriminated union for type-safe offerings
export type Offering =
  | (BaseOffering & { sourceType: typeof SourceTypeEnum.SOLAR } & SolarFields)
  | (BaseOffering & { sourceType: typeof SourceTypeEnum.GAS } & GasFields)
  | (BaseOffering & { sourceType: typeof SourceTypeEnum.WIND } & WindFields)
  | (BaseOffering & { sourceType: typeof SourceTypeEnum.HYDRO } & HydroFields)
  | (BaseOffering & { sourceType: typeof SourceTypeEnum.KINETIC } & KineticFields)
  | (BaseOffering & { sourceType: typeof SourceTypeEnum.THERMAL } & ThermalFields);

// Type guards for validation
export function isSolarOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: typeof SourceTypeEnum.SOLAR } & SolarFields {
  return offering.sourceType === SourceTypeEnum.SOLAR;
}

export function isGasOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: typeof SourceTypeEnum.GAS } & GasFields {
  return offering.sourceType === SourceTypeEnum.GAS;
}

export function isWindOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: typeof SourceTypeEnum.WIND } & WindFields {
  return offering.sourceType === SourceTypeEnum.WIND;
}

export function isHydroOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: typeof SourceTypeEnum.HYDRO } & HydroFields {
  return offering.sourceType === SourceTypeEnum.HYDRO;
}

export function isKineticOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: typeof SourceTypeEnum.KINETIC } & KineticFields {
  return offering.sourceType === SourceTypeEnum.KINETIC;
}

export function isThermalOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: typeof SourceTypeEnum.THERMAL } & ThermalFields {
  return offering.sourceType === SourceTypeEnum.THERMAL;
}
