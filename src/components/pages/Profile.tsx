// src/components/pages/Profile.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { client } from '@passwordless-id/webauthn';
import { Trans, useTranslation } from 'react-i18next';
import { RegisterOptions, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';
import { Box, Button, CircularProgress, Typography, Divider, Chip, Slider, IconButton, Paper, Link, Grid2 } from '@mui/material';

import { Input } from '@components/Input';
import { ProfilePageProps } from './Profile.types';
import { passkeyStore } from '@stores/passkeyStore';
import { useFlashStore } from '@components/FlashMessage';

export const Profile: React.FC<ProfilePageProps> = ({ icons, services, contextStore }) => {
  const { t } = useTranslation();
  const context = contextStore();
  const flashStore = useFlashStore();
  const passkeyStored = passkeyStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formEntities, setFormEntities] = React.useState({ old: { value: '', valid: false }, new: { value: '', valid: false }, conf: { value: '', valid: false } });
  const [passkeyLabel, setPasskeyLabel] = React.useState({ value: '', valid: false });

  const [passkeys, setPasskeys] = React.useState<any[]>([]);
  const [loadingPasskeys, setLoadingPasskeys] = React.useState(false);
  const [errorPasskeys, setErrorPasskeys] = React.useState<string | null>(null);

  const formIsValid = formEntities.new.valid && formEntities.old.valid && formEntities.conf.valid && formEntities.new.value === formEntities.conf.value;

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await services.updPasswordUsecase.execute({
        old_value: formEntities.old.value,
        new_value: formEntities.new.value,
        conf_value: formEntities.conf.value,
      });
      if (response.message === 'SUCCESS') {
        flashStore.open(t('profile.passwordUpdated'));
        setFormEntities({ old: { value: '', valid: false }, new: { value: '', valid: false }, conf: { value: '', valid: false } });
      } else {
        setError(response.message);
        services.loggerService.debug(response.error);
      }
    } catch (err: any) {
      setError(err.message);
      services.loggerService.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPasskeys = async () => {
    setLoadingPasskeys(true);
    setErrorPasskeys(null);
    try {
      const response = await services.getPasskeyForUserUsecase.execute();
      if (response.message === 'SUCCESS') {
        setPasskeys(response.data || []);
      } else {
        setErrorPasskeys(response.message);
      }
    } catch (err: any) {
      setErrorPasskeys(err.message);
    } finally {
      setLoadingPasskeys(false);
    }
  };

  const handleAddPasskey = async () => {
    try {
      const challenge = crypto.randomUUID();
      const formattedDate = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
      const passkey_display = `${context.code} (${passkeyLabel.value} - ${formattedDate})`;

      /**
       * Ask device passkey auth
       */
      const registerOptions: RegisterOptions = {
        user: passkey_display,
        challenge: challenge,
        userVerification: "required",
        discoverable: "preferred",
        timeout: 60000,
        attestation: true,
      }
      const registration: RegistrationJSON = await client.register(registerOptions);

      /**
       * Record to back passkey
       */
      const data = {
        label: passkeyLabel.value,
        challenge,
        hostname: location.hostname,
        registration,
      };

      const response = await services.createPasskeyUsecase.execute(data);
      if (response.message === 'SUCCESS') {
        flashStore.open(t('profile.passkey_created'));

        /**
         * Record local storage passkey
         */
        passkeyStore.setState({
          display: passkey_display,
          passkey_id: response.data.id,
          user_code: context.code,
          challenge: challenge,
          credential_id: registration.id
        });

        setPasskeyLabel({ value: '', valid: false });
        loadPasskeys();
      } else {
        flashStore.open(t(`profile.${response.message}`));
      }
    } catch (err: any) {
      flashStore.open(t('profile.passkey_add_error'));
      services.loggerService.error(err);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      const response = await services.deletePasskeyUsecase.execute({ passkey_id: passkeyId });
      if (response.message === 'SUCCESS') {
        flashStore.open(t('profile.passkey_deleted'));
        loadPasskeys();
      } else {
        flashStore.open(t(`profile.${response.message}`));
      }
    } catch (err: any) {
      flashStore.open(t('profile.passkey_delete_error'));
      services.loggerService.error(err);
    }
  };

  const handleActivatePasskey = (dto: any) => {
    passkeyStore.setState({
      passkey_id: dto.id,
      user_code: dto.user_code,
      challenge: dto.challenge,
      credential_id: dto.credential_id
    });
    flashStore.open(t('profile.passkey_activated'));
  };

  React.useEffect(() => {
    loadPasskeys();
  }, []);

  return (
    <Box className="profile" p={3}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          <Trans>profile.title</Trans>
        </Typography>

        {/* User Info */}
        <Grid2 container spacing={2} alignItems="center" justifyContent="center" mb={4}>
          <Grid2 size={{ xs: 12, sm: 4 }} textAlign="center">
            <Typography><Trans>profile.code</Trans> {context.code}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }} textAlign="center">
            <Typography><Trans>profile.name_first</Trans> {context.name_first}</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }} textAlign="center">
            <Typography><Trans>profile.name_last</Trans> {context.name_last}</Typography>
          </Grid2>
        </Grid2>

        {/* Password Section */}
        <Divider sx={{ my: 2 }}>
          <Chip label={<Trans>profile.password</Trans>} />
        </Divider>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={50} />
          </Box>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <Grid2 container spacing={2}>
              {['old', 'new', 'conf'].map((field, idx) => (
                <Grid2 key={field} size={{ xs: 12, sm: 4 }}>
                  <Input
                    label={<Trans>{`profile.${field}Password`}</Trans>}
                    tooltip={<Trans>REGEX.PASSWORD</Trans>}
                    regex=".{6,}"
                    type="password"
                    entity={formEntities[field as keyof typeof formEntities]}
                    onChange={(entity: any) => setFormEntities(prev => ({ ...prev, [field]: entity }))}
                    icons={icons}
                    require
                    virgin
                  />
                </Grid2>
              ))}
              {error && (
                <Grid2 size={{ xs: 12 }}>
                  <Typography color="error" textAlign="center"><Trans>profile.{error}</Trans></Typography>
                </Grid2>
              )}
              <Grid2 size={{ xs: 12 }} textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={icons.done}
                  disabled={!formIsValid}
                >
                  <Trans>common.done</Trans>
                </Button>
              </Grid2>
            </Grid2>
          </form>
        )}

        {/* Volume Section */}
        <Divider sx={{ my: 4 }}>
          <Chip label={<Trans>profile.settings</Trans>} />
        </Divider>

        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1">
            <Trans>profile.volumeControl</Trans>: {Math.round((context.volume ?? 1) * 100)}%
          </Typography>
          <Slider
            value={context.volume ?? 1}
            min={0}
            max={1}
            step={0.1}
            onChange={(_, newValue) => contextStore.setState({ volume: newValue })}
            valueLabelDisplay="auto"
            sx={{ width: '80%', mt: 2 }}
          />
        </Box>

        {/* Passkey Section */}
        <Divider sx={{ my: 4 }}>
          <Chip label={<Trans>profile.passkeys</Trans>} />
        </Divider>

        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
          <Input
            label={<Trans>profile.passkey_label</Trans>}
            tooltip={<Trans>REGEX.PASSKEY_LABEL</Trans>}
            regex=".{3,}"
            entity={passkeyLabel}
            onChange={(entity) => setPasskeyLabel(entity)}
            icons={icons}
            require
            virgin
          />
          <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
          <IconButton
            color="primary"
            sx={{ p: '10px' }}
            title={t('profile.add_passkey')}
            disabled={!passkeyLabel.valid}
            onClick={(e) => {
              e.preventDefault();
              handleAddPasskey();
            }}
          >
            {icons.add}
          </IconButton>
        </Paper>

        {loadingPasskeys ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : errorPasskeys ? (
          <Typography color="error" textAlign="center"><Trans>profile.passkey_list_error</Trans></Typography>
        ) : passkeys.length === 0 ? (
          <Typography textAlign="center"><Trans>profile.no_passkeys</Trans></Typography>
        ) : (
          passkeys.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography noWrap>{p.label}</Typography>
                <Box>
                  <IconButton title={t('profile.passkey.table.delete')} onClick={() => handleDeletePasskey(p.id)}>
                    {icons.delete}
                  </IconButton>
                  <IconButton
                    title={t('profile.passkey.table.active')}
                    disabled={p.id === passkeyStored.passkey_id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleActivatePasskey(p);
                    }}
                  >
                    <Box component="span" sx={{ color: p.id === passkeyStored.passkey_id ? 'green' : 'grey' }}>
                      {icons.key}
                    </Box>
                  </IconButton>
                </Box>
              </Paper>
            </motion.div>
          ))
        )}

        <Box textAlign="center" mt={2}>
          <Link href="ms-settings:savedpasskeys" underline="hover">
            <Trans>profile.keys</Trans>
          </Link>
        </Box>

      </motion.div>
    </Box>
  );
};
