// src\usecases\passkey\options\passkeyRegisterOptions.usecase.ts
import { CODES } from '@commons/codes';

export interface PasskeyRegisterOptions {
  challenge: string;
  /** Identifiant opaque et **stable** du compte, au sens WebAuthn. */
  user_handle: string;
  /** Credentials déjà enregistrées, que l'authentificateur doit refuser de
   *  dupliquer. */
  exclude_credentials: string[];
}

/**
 * Demande au serveur de quoi amorcer un enregistrement de passkey.
 *
 * Deux valeurs ne peuvent venir que de lui. Le **challenge**, pour les mêmes
 * raisons qu'à l'authentification. Et le **user handle** : la bibliothèque en
 * fabrique un au hasard quand on ne lui en donne pas, ce qui donnait un
 * identifiant différent à chaque clé — le gestionnaire de mots de passe voyait
 * autant de comptes que de passkeys, et aucune assertion ne permettait de
 * remonter au compte.
 */
export class PasskeyRegisterOptionsUsecase {
  constructor(private inversify: any) {}

  async execute(): Promise<{
    message: string;
    data?: PasskeyRegisterOptions;
    error?: string;
  }> {
    try {
      const response: any = await this.inversify.graphqlService.send({
        operationName: 'passkey_register_options',
        variables: {},
        query: `query passkey_register_options {
            passkey_register_options {
              challenge
              user_handle
              exclude_credentials
            }
          }`,
      });

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.passkey_register_options,
      };
    } catch (e: any) {
      return {
        message: CODES.CREATE_PASSKEY_FAIL,
        error: e.message,
      };
    }
  }
}
