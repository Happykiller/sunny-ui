// src\usecases\passkey\auth\authPasskey.usecase.ts
import { CODES } from '@commons/codes';
import { AuthPasskeyUsecaseDto } from './authPasskey.usecase.dto';
import { AuthPasskeyUsecaseModel } from './authPasskey.usecase.model';

export class AuthPasskeyUsecase {

  constructor(
    private inversify:any
  ){}

  async execute(dto: AuthPasskeyUsecaseDto): Promise<AuthPasskeyUsecaseModel>  {
    try {
      let dtobis:any = dto;
      delete dtobis.authentication.clientExtensionResults;
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'auth_passkey',
          variables: {
            dto
          },
          query: `query auth_passkey($dto: PasskeyAuthResolverDto!) {
            auth_passkey (
              dto: $dto
            ) {
              access_token
              id
              code
              name_first
              name_last
              description
              mail
              role
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.auth_passkey
      }
    } catch (e: any) {
      return {
        message: CODES.AUTH_FAIL_WRONG_CREDENTIAL,
        error: e.message
      }
    }
  }
}