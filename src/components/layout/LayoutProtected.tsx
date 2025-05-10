// src/components/LayoutProtected.tsx
import type { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
          background: theme.palette.background.default,
          backgroundImage: `
            radial-gradient(ellipse at 50% 0%, ${theme.palette.primary.main}40 0%, transparent 70%),
            linear-gradient(135deg, ${theme.palette.background.default} 0%, #1B1F3B 100%)
          `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {header}

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 1, md: 4 },
              py: { xs: 2, md: 4 },
            }}
          >
            {children}
          </Container>
        </Box>

        <Box component="footer">
          {footer}
        </Box>
      </Box>
    </Guard>
  );
}
