// src\components\pages\Login.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { client } from '@passwordless-id/webauthn';
import { Trans, useTranslation } from 'react-i18next';
import { AuthenticationJSON, AuthenticateOptions } from '@passwordless-id/webauthn/dist/esm/types';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Stack,
} from '@mui/material';

import { Input } from '@components/Input';
import type { LoginPageProps } from './Login.types';
import { useFlashStore } from '@hooks/useFlashStore';

export const Login: React.FC<LoginPageProps> = ({
  icons,
  services,
  contextStore
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash = useFlashStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const logoSrc = theme.palette.mode === 'dark' ? '/logo_dark.png' : '/logo_light.png';

  const [formEntities, setFormEntities] = React.useState({
    login: { value: '', valid: false },
    password: { value: '', valid: false },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const altKeyPressed = (e as unknown as MouseEvent).altKey;
    if (altKeyPressed) {
      console.debug('🛠️ Debug mode - Form Data:', formEntities);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await services.authUsecase.execute({
        login: formEntities.login.value,
        password: formEntities.password.value,
      });

      if (response.message === 'SUCCESS' && response.data) {
        contextStore.setState({
          id: response.data.id,
          code: response.data.code,
          access_token: response.data.access_token,
          name_first: response.data.name_first,
          name_last: response.data.name_last,
        });
        navigate('/');
      } else {
        services.loggerService.debug(response.error);
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Le challenge vient du serveur et ne sert qu'une fois. Il était auparavant
   * lu dans le `localStorage`, où l'enregistrement l'avait déposé : constant,
   * donc rejouable, et absent de tout autre navigateur que celui d'origine.
   */
  const demanderChallenge = async (): Promise<string> => {
    const options = await services.passkeyAuthOptionsUsecase.execute();
    if (options.message !== 'SUCCESS' || !options.data) {
      throw new Error(options.error ?? options.message);
    }
    return options.data.challenge;
  };

  /**
   * Ouvre la session à partir d'une assertion, d'où qu'elle vienne — du bouton
   * ou de l'autofill.
   *
   * Aucun `user_code` n'est envoyé : c'est la credential présentée qui désigne
   * le compte. C'est ce qui rend la connexion possible sur un poste où le
   * navigateur ne sait rien — le cas d'une passkey synchronisée dans un
   * gestionnaire.
   */
  const ouvrirSession = async (authentication: AuthenticationJSON) => {
    const session = await services.authPasskeyUsecase.execute({ authentication });

    if (session.message === 'SUCCESS' && session.data) {
      contextStore.setState({
        id: session.data.id,
        code: session.data.code,
        access_token: session.data.access_token,
        name_first: session.data.name_first,
        name_last: session.data.name_last,
      });
      navigate('/');
    } else {
      throw new Error(session.message);
    }
  };

  /**
   * Un `message` d'exception ne fait une clé de traduction que s'il en a la forme.
   * Les erreurs que nous levons nous-mêmes portent un code court
   * (`authentication_failed`, `passkey_failed`) ; celles du navigateur portent une
   * phrase anglaise — « Resident credentials or empty 'allowCredentials' lists are
   * not supported at this time. » — que i18next ne peut pas résoudre et réaffiche
   * donc telle quelle, préfixée de `login.`. D'où ce filtre sur la forme.
   */
  const estCodeDeTraduction = (valeur: unknown): valeur is string =>
    typeof valeur === 'string' && /^[A-Za-z0-9_]+$/.test(valeur);

  /**
   * Une annulation n'est pas une panne : l'utilisateur qui ferme le sélecteur
   * de son gestionnaire (`NotAllowedError`) comme l'appel conditionnel que nous
   * interrompons nous-mêmes (`AbortError`) ne méritent aucun message.
   *
   * `silencieux` couvre l'autofill : cette cérémonie démarre toute seule à
   * l'affichage de l'écran, sans que personne l'ait demandée. Son échec ne
   * regarde que les logs — sinon un navigateur qui annonce savoir faire
   * l'autofill sans y parvenir accueille l'utilisateur par une erreur rouge
   * pour un mécanisme qu'il n'a pas sollicité.
   */
  const signalerEchec = (e: any, options: { silencieux?: boolean } = {}) => {
    services.loggerService.error(e?.message || e);
    if (e?.name === 'AbortError' || e?.name === 'NotAllowedError') return;
    if (options.silencieux) return;
    const cle = estCodeDeTraduction(e?.message) ? e.message : 'passkey_failed';
    flash.open(t(`login.${cle}`));
    setError(cle);
  };

  const handlePasskeyLogin = async () => {
    try {
      setLoading(true);
      services.loggerService.debug('Starting passkey authentication');

      const options: AuthenticateOptions = {
        challenge: await demanderChallenge(),
        userVerification: 'required',
        timeout: 60000,
        // Pas d'`allowCredentials` : c'est ce qui laisse le navigateur proposer
        // les passkeys du domaine qu'il connaît, sans que le site sache d'avance
        // qui se connecte. La liste précédente était construite depuis le
        // `localStorage`, avec un `transports: ['internal']` codé en dur qui
        // écartait justement les clés synchronisées.
      };

      const authentication: AuthenticationJSON = await client.authenticate(options);

      if (!authentication) {
        throw new Error('authentication_failed');
      }

      await ouvrirSession(authentication);
    } catch (e: any) {
      signalerEchec(e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Autofill (conditional UI) : la passkey est proposée directement dans le
   * champ identifiant, sans que l'utilisateur ait à cliquer quoi que ce soit.
   *
   * L'appel reste pendant jusqu'à ce qu'une clé soit choisie. La bibliothèque
   * annule d'elle-même celui en cours dès qu'un autre appel WebAuthn démarre :
   * le bouton et l'enregistrement n'ont donc rien de particulier à faire.
   */
  React.useEffect(() => {
    let abandonne = false;

    (async () => {
      try {
        if (!(await client.isAutocompleteAvailable())) return;

        const authentication: AuthenticationJSON = await client.authenticate({
          challenge: await demanderChallenge(),
          userVerification: 'required',
          autocomplete: true,
        });

        // Le composant a pu être démonté entre-temps — l'utilisateur est parti
        // ailleurs, on ne le ramène pas de force.
        if (abandonne || !authentication) return;

        await ouvrirSession(authentication);
      } catch (e: any) {
        signalerEchec(e, { silencieux: true });
      }
    })();

    return () => {
      abandonne = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: `${theme.shape.borderRadius}px`,
            backgroundColor: theme.palette.background.default,
            boxShadow: `
              0 0 24px ${theme.palette.primary.main}33,
              0 0 64px ${theme.palette.primary.main}1A,
              inset 0 0 8px rgba(255, 255, 255, 0.02)
            `,
            border: `1px solid ${theme.palette.primary.main}`,
            backdropFilter: 'blur(2px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: `${theme.shape.borderRadius}px`,
                  boxShadow: `
                    0 0 24px ${theme.palette.primary.main}33,
                    0 0 64px ${theme.palette.primary.main}1A,
                    inset 0 0 8px rgba(255, 255, 255, 0.02)
                  `,
                  backgroundColor: theme.palette.background.default,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={logoSrc}
                  alt="Logo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h1" gutterBottom>
              <Trans>login.title</Trans>
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress size={50} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Input
                  label={<Trans>login.login</Trans>}
                  tooltip={<Trans>REGEX.LOGIN</Trans>}
                  startIcon={icons.person}
                  // La valeur exacte attendue par la conditional UI : c'est ce
                  // marqueur qui fait proposer les passkeys dans la liste
                  // d'autocomplétion du champ.
                  autoComplete="username webauthn"
                  regex="^[a-zA-Z0-9._-]{3,}$"
                  entity={formEntities.login}
                  onChange={(entity: any) =>
                    setFormEntities((prev) => ({ ...prev, login: entity }))
                  }
                  icons={icons}
                  require
                  virgin
                />

                <Input
                  label={<Trans>login.password</Trans>}
                  tooltip={<Trans>REGEX.PASSWORD</Trans>}
                  startIcon={icons.lock}
                  regex=".{6,}"
                  type="password"
                  entity={formEntities.password}
                  onChange={(entity: any) =>
                    setFormEntities((prev) => ({ ...prev, password: entity }))
                  }
                  icons={icons}
                  require
                  virgin
                />

                {error && (
                  <Typography color="error" variant="body2">
                    <Trans>login.{error}</Trans>
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={icons.done}
                  disabled={!(formEntities.login.valid && formEntities.password.valid)}
                >
                  <Trans>common.done</Trans>
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={icons.key}
                  // Plus de `disabled` : le bouton était grisé tant que le
                  // `localStorage` de CE navigateur ne portait pas de
                  // `user_code`. Une passkey synchronisée ouverte sur un autre
                  // poste restait donc inutilisable, sans le moindre message.
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePasskeyLogin();
                  }}
                >
                  <Trans>login.passkey</Trans>
                </Button>
              </Stack>
            </form>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};
