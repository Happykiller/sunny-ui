// src/components/LayoutProtected.tsx
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, useTheme } from '@mui/material';

import { Guard } from '@components/Guard';

export interface LayoutProtectedProps {
  header: ReactNode;
  footer: ReactNode;
  sessionInfoUsecase: { execute: () => Promise<any> };
  loggerService: { debug(...args: any[]): void };
  contextStore: any;
  children: ReactNode;
}

export function LayoutProtected({
  header,
  footer,
  sessionInfoUsecase,
  loggerService,
  contextStore,
  children,
}: LayoutProtectedProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const reset = contextStore((state: any) => state.reset);

  const checkSession = () =>
    sessionInfoUsecase.execute().then(response => ({
      success: response.message === 'SUCCESS',
      error: response.error,
    }));

  const onInvalidSession = () => {
    reset();
    loggerService.debug(t('errors.session_invalid'));
  };

  return (
    <Guard checkSession={checkSession} onInvalidSession={onInvalidSession}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {header}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 1, sm: 2 },
            pt: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              flex: 1,
              px: { xs: 1, sm: 2 },
              pt: 2,
            }}
          >{children}</Box>
        </Box>

        {footer}
      </Box>
    </Guard>
  );
}
