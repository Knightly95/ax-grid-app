export type SourceType = 'solar' | 'gas' | 'wind' | 'hydro' | 'kinetic' | 'thermal';

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
  kineticSourceType?: string; // kinetic source type (pedestrian, vehicle, turbine)
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
  | (BaseOffering & { sourceType: 'solar' } & SolarFields)
  | (BaseOffering & { sourceType: 'gas' } & GasFields)
  | (BaseOffering & { sourceType: 'wind' } & WindFields)
  | (BaseOffering & { sourceType: 'hydro' } & HydroFields)
  | (BaseOffering & { sourceType: 'kinetic' } & KineticFields)
  | (BaseOffering & { sourceType: 'thermal' } & ThermalFields);

// Type guards for validation
export function isSolarOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: 'solar' } & SolarFields {
  return offering.sourceType === 'solar';
}

export function isGasOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: 'gas' } & GasFields {
  return offering.sourceType === 'gas';
}

export function isWindOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: 'wind' } & WindFields {
  return offering.sourceType === 'wind';
}

export function isHydroOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: 'hydro' } & HydroFields {
  return offering.sourceType === 'hydro';
}

export function isKineticOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: 'kinetic' } & KineticFields {
  return offering.sourceType === 'kinetic';
}

export function isThermalOffering(
  offering: Offering,
): offering is BaseOffering & { sourceType: 'thermal' } & ThermalFields {
  return offering.sourceType === 'thermal';
}
