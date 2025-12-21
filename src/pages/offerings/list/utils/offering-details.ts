import type { Offering } from '@/shared/types/offering';
import { SourceTypeEnum } from '@/shared/types/offering';
import { formatPrice } from '@/shared/utils/format';

interface DetailField {
  label: string;
  value: string | number;
}

export function getCapacityUnit(sourceType: string): string {
  return sourceType === SourceTypeEnum.KINETIC ? 'kW' : 'MW';
}

export function getCapacity(offering: Offering): string {
  if ('capacity' in offering && offering.capacity) {
    const unit = getCapacityUnit(offering.sourceType);
    return `${offering.capacity} ${unit}`;
  }
  return 'N/A';
}

export function getLocation(offering: Offering): string {
  if ('location' in offering && offering.location) {
    return offering.location;
  }
  return 'Not specified';
}

export function buildDetailFields(offering: Offering): DetailField[] {
  const details: DetailField[] = [
    { label: 'Vendor', value: offering.vendor },
    { label: 'Source Type', value: offering.sourceType },
  ];

  const addDetail = (condition: boolean, label: string, value: string | number) => {
    if (condition) {
      details.push({ label, value });
    }
  };

  addDetail(!!offering.price, 'Price', formatPrice(offering.price || 0));

  if ('capacity' in offering && offering.capacity) {
    const unit = getCapacityUnit(offering.sourceType);
    addDetail(true, 'Capacity', `${offering.capacity} ${unit}`);
  }

  if ('location' in offering && offering.location) {
    addDetail(true, 'Location', offering.location);
  }

  addDetail(!!offering.minQuantity, 'Minimum Quantity', `${offering.minQuantity} MWh`);
  addDetail(!!offering.contractTerms, 'Contract Terms', offering.contractTerms!);
  addDetail(!!offering.paymentTerms, 'Payment Terms', offering.paymentTerms!);

  if ('outputPrediction' in offering) {
    addDetail(!!offering.outputPrediction, 'Output Prediction', `${offering.outputPrediction}%`);
  }

  if ('availabilityWindow' in offering) {
    addDetail(!!offering.availabilityWindow, 'Availability Window', offering.availabilityWindow!);
  }

  if ('deliveryMethod' in offering) {
    addDetail(!!offering.deliveryMethod, 'Delivery Method', offering.deliveryMethod);
  }

  if ('flexibility' in offering) {
    addDetail(!!offering.flexibility, 'Flexibility', offering.flexibility!);
  }

  if ('emissions' in offering) {
    addDetail(!!offering.emissions, 'Emissions', offering.emissions!);
  }

  if ('windSpeedPrediction' in offering) {
    addDetail(
      !!offering.windSpeedPrediction,
      'Wind Speed Prediction',
      `${offering.windSpeedPrediction} m/s`,
    );
  }

  if ('turbineEfficiency' in offering) {
    addDetail(!!offering.turbineEfficiency, 'Turbine Efficiency', `${offering.turbineEfficiency}%`);
  }

  if ('waterFlowRate' in offering) {
    addDetail(!!offering.waterFlowRate, 'Water Flow Rate', `${offering.waterFlowRate} m³/s`);
  }

  if ('reservoirLevel' in offering) {
    addDetail(!!offering.reservoirLevel, 'Reservoir Level', `${offering.reservoirLevel}%`);
  }

  if ('conversionEfficiency' in offering) {
    addDetail(
      !!offering.conversionEfficiency,
      'Conversion Efficiency',
      `${offering.conversionEfficiency}%`,
    );
  }

  if ('kineticSourceType' in offering) {
    addDetail(!!offering.kineticSourceType, 'Kinetic Source', offering.kineticSourceType!);
  }

  if ('heatSourceType' in offering) {
    addDetail(!!offering.heatSourceType, 'Heat Source', offering.heatSourceType!);
  }

  if ('temperatureGradient' in offering) {
    addDetail(
      !!offering.temperatureGradient,
      'Temperature Gradient',
      `${offering.temperatureGradient}°C`,
    );
  }

  if ('certifications' in offering && offering.certifications?.length) {
    addDetail(true, 'Certifications', offering.certifications.join(', '));
  }

  return details;
}
