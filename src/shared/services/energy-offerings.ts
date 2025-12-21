import { useQuery } from '@tanstack/react-query';

import type { EnergyOfferingsConfig } from '@/shared/types/form-config';
import { config } from '@/config';

export async function fetchEnergyOfferingsConfig(): Promise<EnergyOfferingsConfig> {
  const response = await fetch(`${config.api.baseUrl}/api/energy-offerings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch energy offerings config: ${response.statusText}`);
  }

  const data: unknown = await response.json();
  return data as EnergyOfferingsConfig;
}

export function useEnergyOfferings() {
  return useQuery({
    queryKey: ['energy-offerings-config'],
    queryFn: fetchEnergyOfferingsConfig,
    retry: 2,
  });
}
