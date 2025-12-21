import { useQuery } from '@tanstack/react-query';

import type { EnergyOfferingsConfig } from '@/shared/types/form-config';

const API_BASE_URL = 'http://localhost:3000';

export async function fetchEnergyOfferingsConfig(): Promise<EnergyOfferingsConfig> {
  const response = await fetch(`${API_BASE_URL}/api/energy-offerings`);

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
