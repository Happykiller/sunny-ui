// src/components/pages/LoginPage.types.ts
import type { ReactNode } from 'react';

export interface LoginPageProps {
  icons: {
    visibility: ReactNode;
    visibilityOff: ReactNode;
    help: ReactNode;
    done: ReactNode;
    key: ReactNode;
  };
  services: {
    authUsecase: {
      execute: (params: { login: string; password: string }) => Promise<any>;
    };
    authPasskeyUsecase: {
      execute: (params: any) => Promise<any>;
    };
    loggerService: {
      debug: (msg: any) => void;
      error: (msg: any) => void;
    };
  };
  contextStore: {
    setState: (state: any) => void;
  };
}
