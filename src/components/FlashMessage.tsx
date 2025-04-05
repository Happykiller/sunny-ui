import React, { useEffect } from 'react';
import { create } from 'zustand';
import { useTheme } from '@mui/material/styles';
import { Alert, AlertColor, IconButton, Stack, SnackbarOrigin, Collapse } from '@mui/material';

export interface FlashIcons {
  close?: React.ReactNode;
}

interface FlashQueueItem {
  id: number;
  msg: string;
  severity: AlertColor;
  timeout?: NodeJS.Timeout;
}

interface FlashState {
  queue: FlashQueueItem[];
  open: (msg: string, severity?: AlertColor) => void;
  close: (id: number) => void;
}

let idCounter = 0;

export const useFlashStore = create<FlashState>((set, get) => ({
  queue: [],
  open: (msg, severity = 'info') => {
    const id = ++idCounter;
    const timeout = setTimeout(() => get().close(id), 6000);
    set((state) => ({
      queue: [...state.queue, { id, msg, severity, timeout }],
    }));
  },
  close: (id) => {
    const { queue } = get();
    const item = queue.find((i) => i.id === id);
    if (item?.timeout) clearTimeout(item.timeout);
    set({ queue: queue.filter((item) => item.id !== id) });
  },
}));

interface FlashMessageProps {
  icons?: FlashIcons;
  maxVisible?: number;
  anchorOrigin?: SnackbarOrigin;
}

export const FlashMessage: React.FC<FlashMessageProps> = ({ icons = {}, maxVisible = 5, anchorOrigin = { vertical: 'bottom', horizontal: 'right' } }) => {
  const theme = useTheme();
  const { queue, close } = useFlashStore();
  const visibleQueue = queue.slice(-maxVisible);

  return (
    <Stack spacing={1} sx={{ position: 'fixed', zIndex: 1300, ...anchorOriginToPosition(anchorOrigin) }}>
      {visibleQueue.map(({ id, msg, severity }) => (
        <Collapse in key={id}>
          <Alert
            severity={severity}
            onClose={() => close(id)}
            sx={{
              width: '100%',
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.grey[100],
              color: theme.palette.text.primary,
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => close(id)}
              >
                {icons.close}
              </IconButton>
            }
          >
            {msg}
          </Alert>
        </Collapse>
      ))}
    </Stack>
  );
};

function anchorOriginToPosition(anchor: SnackbarOrigin): React.CSSProperties {
  const vertical = anchor.vertical === 'top' ? { top: 16 } : { bottom: 16 };
  const horizontal = anchor.horizontal === 'left' ? { left: 16 } : anchor.horizontal === 'center' ? { left: '50%', transform: 'translateX(-50%)' } : { right: 16 };
  return { position: 'fixed', ...vertical, ...horizontal, zIndex: 1300 };
}
