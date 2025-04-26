// src/components/pages/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { Input } from '../../components/Input';
import type { LoginPageProps } from './Login.types';
import { useFlashStore } from '../../components/FlashMessage';

import './login.scss';

export const Login: React.FC<LoginPageProps> = ({
  icons,
  services,
  contextStore,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash = useFlashStore();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formEntities, setFormEntities] = React.useState({
    login: { value: '', valid: false },
    password: { value: '', valid: false },
  });

  const [passkey, setPasskey] = React.useState({
    user_code: '',
    display: '',
    challenge: '',
    credential_id: '',
  });

  // -- Login form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  // -- Passkey login
  const handlePasskeyLogin = async () => {
    try {
      setLoading(true);
      services.loggerService.debug('Starting passkey authentication');

      // Ici tu dois passer la logique réelle (c'est un squelette pour intégrer avec @passwordless-id/webauthn)
      const session = await services.authPasskeyUsecase.execute({
        authentication: {}, // <-- Remplacer par ton flow réel
        user_code: passkey.user_code,
      });

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
    } catch (e: any) {
      flash.open(t(`login.${e.message}`));
      services.loggerService.error(e.message || e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login">
      <Typography variant="h4" mb={4}>
        <Trans>login.title</Trans>
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label={<Trans>login.login</Trans>}
            tooltip={<Trans>REGEX.LOGIN</Trans>}
            regex="^[a-zA-Z0-9._-]{3,}$"
            entity={formEntities.login}
            onChange={(entity: any) =>
              setFormEntities((prev) => ({ ...prev, login: entity }))
            }
            icons={{
              visibility: icons.visibility,
              visibilityOff: icons.visibilityOff,
              help: icons.help,
            }}
            require
            virgin
          />

          <Input
            label={<Trans>login.password</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex=".{6,}"
            type="password"
            entity={formEntities.password}
            onChange={(entity: any) =>
              setFormEntities((prev) => ({ ...prev, password: entity }))
            }
            icons={{
              visibility: icons.visibility,
              visibilityOff: icons.visibilityOff,
              help: icons.help,
            }}
            require
            virgin
          />

          {error && (
            <Typography color="error" mt={2}>
              <Trans>login.{error}</Trans>
            </Typography>
          )}

          <Box display="flex" flexDirection="column" gap={2} mt={4}>
            <Button
              type="submit"
              variant="contained"
              startIcon={icons.done}
              disabled={!(formEntities.login.valid && formEntities.password.valid)}
            >
              <Trans>common.done</Trans>
            </Button>

            <Button
              variant="outlined"
              startIcon={icons.key}
              disabled={!passkey.user_code}
              onClick={(e) => {
                e.preventDefault();
                handlePasskeyLogin();
              }}
            >
              <Trans>login.passkey</Trans>
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};
