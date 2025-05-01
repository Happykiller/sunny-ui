// src\usecases\passkey\delete\deletePasskey.usecase.ts
import { CODES } from '@commons/codes';
import DeletePasskeyUsecaseDto from './deletePasskey.usecase.dto';
import DeletePasskeyUsecaseModel from './deletePasskey.usecase.model';

export class DeletePasskeyUsecase {

  constructor(
    private inversify:any
  ){}

  async execute(dto: DeletePasskeyUsecaseDto): Promise<DeletePasskeyUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'delete_passkey',
          variables: dto,
          query: `mutation delete_passkey($passkey_id: String!) {
            delete_passkey (
              dto: {
                passkey_id: $passkey_id
              }
            )
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: true
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.DELETE_PASSKEY_FAIL,
          error: e.message
        }
      }
    }
  }
}