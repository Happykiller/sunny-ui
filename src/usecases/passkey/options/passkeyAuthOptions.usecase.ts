// src\usecases\passkey\options\passkeyAuthOptions.usecase.ts
import { CODES } from '@commons/codes';

/**
 * Demande au serveur de quoi amorcer une authentification.
 *
 * Le challenge doit venir du serveur et ne servir qu'une fois : c'est ce qui
 * empêche qu'une assertion capturée soit rejouée. Il était jusqu'ici lu dans le
 * `localStorage`, où il avait été déposé à l'enregistrement — donc constant, et
 * introuvable sur tout autre navigateur que celui d'origine.
 *
 * L'appel est anonyme, et sa réponse ne contient rien qui désigne un
 * utilisateur : c'est ce qui rend possible la connexion sans identifiant.
 */
export class PasskeyAuthOptionsUsecase {
  constructor(private inversify: any) {}

  async execute(): Promise<{ message: string; data?: { challenge: string }; error?: string }> {
    try {
      const response: any = await this.inversify.graphqlService.send({
        operationName: 'passkey_auth_options',
        variables: {},
        query: `query passkey_auth_options {
            passkey_auth_options {
              challenge
            }
          }`,
      });

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.passkey_auth_options,
      };
    } catch (e: any) {
      return {
        message: CODES.AUTH_FAIL_WRONG_CREDENTIAL,
        error: e.message,
      };
    }
  }
}
