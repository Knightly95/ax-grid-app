import type { SxProps, Theme } from '@mui/material/styles';

export const dataGridAnimationStyles: SxProps<Theme> = {
  border: 0,
  '& .row-flash-new': {
    animation: 'flashRow 3s ease-in-out',
    '@keyframes flashRow': {
      '0%, 100%': { backgroundColor: 'transparent' },
      '8%, 24%': { backgroundColor: 'rgba(76, 175, 80, 0.35)' },
      '16%, 32%': { backgroundColor: 'transparent' },
      '40%, 56%': { backgroundColor: 'rgba(76, 175, 80, 0.35)' },
      '48%, 64%': { backgroundColor: 'transparent' },
      '72%, 88%': { backgroundColor: 'rgba(76, 175, 80, 0.35)' },
      '80%, 96%': { backgroundColor: 'transparent' },
    },
  },
  '& .cell-flash-changed': {
    animation: 'flashCell 3s ease-in-out',
    '@keyframes flashCell': {
      '0%, 100%': { backgroundColor: 'transparent' },
      '8%, 24%': { backgroundColor: 'rgba(255, 152, 0, 0.45)' },
      '16%, 32%': { backgroundColor: 'transparent' },
      '40%, 56%': { backgroundColor: 'rgba(255, 152, 0, 0.45)' },
      '48%, 64%': { backgroundColor: 'transparent' },
      '72%, 88%': { backgroundColor: 'rgba(255, 152, 0, 0.45)' },
      '80%, 96%': { backgroundColor: 'transparent' },
    },
  },
};
