// src/components/LayoutProtected.tsx
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Guard } from '@components/Guard';
import type { ReactNode } from 'react';

export interface LayoutProtectedProps {
  header: ReactNode;
  sessionInfoUsecase: { execute: () => Promise<any> };
  loggerService: { debug(...args: any[]): void };
  contextStore: any;
  children: ReactNode;
}

export function LayoutProtected({
  header,
  sessionInfoUsecase,
  loggerService,
  contextStore,
  children,
}: LayoutProtectedProps) {
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
      <>
        {header}
        <Container maxWidth="xl" sx={{ pt: 2 }}>
          {children}
        </Container>
      </>
    </Guard>
  );
}
