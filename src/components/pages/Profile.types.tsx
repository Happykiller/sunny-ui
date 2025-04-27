// src/components/pages/Profile.types.ts
import type { ReactNode } from 'react';

export interface ProfilePageProps {
  icons: {
    visibility: ReactNode;
    visibilityOff: ReactNode;
    help: ReactNode;
    done: ReactNode;
    key: ReactNode;
    add: ReactNode;
    delete: ReactNode;
  };
  services: {
    createPasskeyUsecase: { execute: (params: any) => Promise<any> };
    deletePasskeyUsecase: { execute: (params: any) => Promise<any> };
    getPasskeyForUserUsecase: { execute: () => Promise<any> };
    updPasswordUsecase: { execute: (params: any) => Promise<any> };
    loggerService: { debug(...args: any[]): void; error(...args: any[]): void; };
  };
  contextStore: any;
  passkeyStore: any;
  flashStore: { open: (message: string) => void };
}
