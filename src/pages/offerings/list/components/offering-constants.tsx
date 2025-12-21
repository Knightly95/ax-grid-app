import {
  WbSunny as SolarIcon,
  LocalGasStation as GasIcon,
  Air as WindIcon,
  Water as HydroIcon,
  ElectricBolt as KineticIcon,
  Whatshot as ThermalIcon,
} from '@mui/icons-material';
import type { SourceType } from '@/shared/types/offering';

export const sourceIcons: Record<SourceType, React.ReactNode> = {
  solar: <SolarIcon />,
  gas: <GasIcon />,
  wind: <WindIcon />,
  hydro: <HydroIcon />,
  kinetic: <KineticIcon />,
  thermal: <ThermalIcon />,
};

export const sourceColors: Record<SourceType, string> = {
  solar: '#FFA726',
  gas: '#66BB6A',
  wind: '#42A5F5',
  hydro: '#26C6DA',
  kinetic: '#AB47BC',
  thermal: '#EF5350',
};
