// src\usecases\passkey\auth\authPasskey.usecase.dto.ts
import { AuthenticationJSON } from '@passwordless-id/webauthn/dist/esm/types';

export interface AuthPasskeyUsecaseDto {
  user_code: string;
  authentication: AuthenticationJSON;
}