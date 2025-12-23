import { fetchEnergyOfferingsConfig, useEnergyOfferings } from '../energy-offerings';
import { config } from '@/config';

let useQueryArgs: unknown = null;
vi.mock('@tanstack/react-query', () => ({
  useQuery: (args: unknown) => {
    useQueryArgs = args;
    return { data: undefined };
  },
}));

describe('fetchEnergyOfferingsConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns config on success', async () => {
    const mockConfig = { common: [], sources: {}, uiHints: { order: [], displayUnits: false } };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig,
    } as Response);
    const result = await fetchEnergyOfferingsConfig();
    expect(result).toEqual(mockConfig);
    expect(fetch).toHaveBeenCalledWith(`${config.api.baseUrl}/api/energy-offerings`);
  });

  it('throws on error response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    } as Response);
    await expect(fetchEnergyOfferingsConfig()).rejects.toThrow(
      'Failed to fetch energy offerings config: Not Found',
    );
  });
});

describe('useEnergyOfferings', () => {
  it('calls useQuery with correct params', () => {
    useQueryArgs = null;
    useEnergyOfferings();
    expect(useQueryArgs).toEqual({
      queryKey: ['energy-offerings-config'],
      queryFn: fetchEnergyOfferingsConfig,
      retry: 2,
    });
  });
});
