import type { SxProps, Theme } from '@mui/material';

export const DEFAULT_MAX_WIDTH = 600;
export const DEFAULT_SHOW_CLOSE_BUTTON = true;
export const DEFAULT_DISABLE_BACKDROP_CLICK = false;
export const DEFAULT_FULL_WIDTH = false;

export const MODAL_MAX_HEIGHT = '90vh';
export const MODAL_FULL_WIDTH_PERCENTAGE = '90%';
export const MODAL_BORDER_WIDTH = '1px solid';

export const defaultModalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  maxHeight: MODAL_MAX_HEIGHT,
  overflow: 'auto',
};
