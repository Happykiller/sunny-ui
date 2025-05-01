// src\usecases\passkey\create\createPasskey.usecase.model.ts
import { PasskeyUsecaseModel } from '../model/passkey.usecase.model';

export interface CreatePasskeyUsecaseModel {
  message: string;
  data?: PasskeyUsecaseModel,
  error?: string;
}