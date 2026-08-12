// src/components/pages/LoginPage.types.ts
import type { ReactNode } from 'react';

export interface LoginPageProps {
  icons: {
    visibility: ReactNode;
    visibilityOff: ReactNode;
    help: ReactNode;
    done: ReactNode;
    key: ReactNode;
    person: ReactNode;
    lock: ReactNode;
  };
  services: {
    authUsecase: {
      execute: (params: { login: string; password: string }) => Promise<any>;
    };
    authPasskeyUsecase: {
      execute: (params: any) => Promise<any>;
    };
    /** Amorce la cérémonie d'authentification : le challenge vient du serveur,
     *  jamais du navigateur. */
    passkeyAuthOptionsUsecase: {
      execute: () => Promise<{
        message: string;
        data?: { challenge: string };
        error?: string;
      }>;
    };
    loggerService: {
      log(...args: any[]): void;
      debug(...args: any[]): void;
      error(...args: any[]): void;
    };
  };
  contextStore: {
    setState: (state: any) => void;
  };
}
