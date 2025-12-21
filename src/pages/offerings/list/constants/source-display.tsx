import type { ReactNode } from 'react';
import {
  WbSunny as SolarIcon,
  LocalGasStation as GasIcon,
  Air as WindIcon,
  Water as HydroIcon,
  ElectricBolt as KineticIcon,
  Whatshot as ThermalIcon,
} from '@mui/icons-material';

import { SourceTypeEnum } from '@/shared/types/offering';
import type { SourceType } from '@/shared/types/offering';

export const sourceIcons: Record<SourceType, ReactNode> = {
  [SourceTypeEnum.SOLAR]: <SolarIcon />,
  [SourceTypeEnum.GAS]: <GasIcon />,
  [SourceTypeEnum.WIND]: <WindIcon />,
  [SourceTypeEnum.HYDRO]: <HydroIcon />,
  [SourceTypeEnum.KINETIC]: <KineticIcon />,
  [SourceTypeEnum.THERMAL]: <ThermalIcon />,
};

export const sourceColors: Record<SourceType, string> = {
  [SourceTypeEnum.SOLAR]: '#FFA726',
  [SourceTypeEnum.GAS]: '#66BB6A',
  [SourceTypeEnum.WIND]: '#42A5F5',
  [SourceTypeEnum.HYDRO]: '#26C6DA',
  [SourceTypeEnum.KINETIC]: '#AB47BC',
  [SourceTypeEnum.THERMAL]: '#EF5350',
};
