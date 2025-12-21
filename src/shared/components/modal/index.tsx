import type { ReactNode } from 'react';
import { Modal as MuiModal, Box, IconButton, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import {
  defaultModalStyle,
  DEFAULT_MAX_WIDTH,
  DEFAULT_SHOW_CLOSE_BUTTON,
  DEFAULT_DISABLE_BACKDROP_CLICK,
  DEFAULT_FULL_WIDTH,
  MODAL_FULL_WIDTH_PERCENTAGE,
  MODAL_BORDER_WIDTH,
} from './constants/modal-constants';

export interface ModalConfig {
  title?: string;
  maxWidth?: string | number;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  config?: ModalConfig;
  children: ReactNode;
}

export function Modal({ open, onClose, config = {}, children }: ModalProps) {
  const {
    title,
    maxWidth = DEFAULT_MAX_WIDTH,
    showCloseButton = DEFAULT_SHOW_CLOSE_BUTTON,
    disableBackdropClick = DEFAULT_DISABLE_BACKDROP_CLICK,
    fullWidth = DEFAULT_FULL_WIDTH,
    sx = {},
  } = config;

  const handleClose = (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    onClose();
  };

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <Box
        sx={{
          ...defaultModalStyle,
          width: fullWidth ? MODAL_FULL_WIDTH_PERCENTAGE : 'auto',
          maxWidth,
          ...(sx as Record<string, unknown>),
        }}
      >
        {(title || showCloseButton) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              pb: 1,
              borderBottom: title ? MODAL_BORDER_WIDTH : 'none',
              borderColor: 'divider',
            }}
          >
            {title && (
              <Typography id="modal-title" variant="h6" component="h2" fontWeight={600}>
                {title}
              </Typography>
            )}
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  ml: 'auto',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
                aria-label="close modal"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}

        <Box id="modal-content" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </MuiModal>
  );
}
