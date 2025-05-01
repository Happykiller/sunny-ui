// src\usecases\passkey\getForUser\getPasskeyForUser.usecase.model.ts
import { PasskeyUsecaseModel } from '../model/passkey.usecase.model';

export interface GetPasskeyForUserUsecaseModel {
  message: string;
  data?: PasskeyUsecaseModel[],
  error?: string;
}