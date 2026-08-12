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
    /** Amorce l'enregistrement : challenge du serveur, user handle stable du
     *  compte, et credentials déjà posées qu'il ne faut pas dupliquer. */
    passkeyRegisterOptionsUsecase: {
      execute: () => Promise<{
        message: string;
        data?: {
          challenge: string;
          user_handle: string;
          exclude_credentials: string[];
        };
        error?: string;
      }>;
    };
    deletePasskeyUsecase: { execute: (params: any) => Promise<any> };
    getPasskeyForUserUsecase: { execute: () => Promise<any> };
    updPasswordUsecase: { execute: (params: any) => Promise<any> };
    loggerService: { debug(...args: any[]): void; error(...args: any[]): void; };
  };
  contextStore: any;
}
