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
import { usePasskeyStore } from '@hooks/usePasskeyStore';

export const Login: React.FC<LoginPageProps> = ({
  icons,
  services,
  contextStore
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const flash = useFlashStore();
  const passkeyStored = usePasskeyStore();
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
      console.debug('🛠️ Debug mode - Form Data:', formEntities, passkeyStored);
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

  const handlePasskeyLogin = async () => {
    try {
      setLoading(true);
      services.loggerService.debug('Starting passkey authentication', passkeyStored);

      const options: AuthenticateOptions = {
        challenge: passkeyStored.challenge ?? '',
        timeout: 60000,
        ...(passkeyStored.credential_id && {
          allowCredentials: [{ id: passkeyStored.credential_id, transports: ['internal'] }],
        }),
      };

      const authentication: AuthenticationJSON = await client.authenticate(options);

      if (!authentication) {
        throw new Error('authentication_failed');
      }

      const session = await services.authPasskeyUsecase.execute({
        authentication,
        user_code: passkeyStored.user_code,
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
    <Box
      sx={{
        minHeight: '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        background: theme.palette.background.default,
        backgroundImage: `
        radial-gradient(ellipse at 50% 0%, ${theme.palette.primary.main}40 0%, transparent 70%),
        linear-gradient(135deg, ${theme.palette.background.default} 0%, #1B1F3B 100%)
      `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
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
            <Box display="flex" justifyContent="center" mb={3}>
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

          <Box textAlign="center" mb={3}>
            <Typography variant="h1" gutterBottom>
              <Trans>login.title</Trans>
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress size={50} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Input
                  label={<Trans>login.login</Trans>}
                  tooltip={<Trans>REGEX.LOGIN</Trans>}
                  startIcon={icons.person}
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
                  disabled={!passkeyStored.user_code}
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
