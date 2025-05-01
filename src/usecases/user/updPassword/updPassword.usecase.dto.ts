// src\usecases\user\updPassword\updPassword.usecase.dto.ts
export default interface UpdPasswordUsecaseDto {
  old_value: string;
  new_value: string;
  conf_value: string;
}