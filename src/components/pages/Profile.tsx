// src/components/pages/Profile.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, Typography, Divider, Chip, Slider, IconButton, Paper, Link, Grid2 } from '@mui/material';

import { Input } from '@components/Input';
import { ProfilePageProps } from './Profile.types';

export const Profile: React.FC<ProfilePageProps> = ({ icons, services, contextStore, flashStore }) => {
  const { t } = useTranslation();
  const context = contextStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formEntities, setFormEntities] = React.useState({ old: { value: '', valid: false }, new: { value: '', valid: false }, conf: { value: '', valid: false } });
  const [passkeyLabel, setPasskeyLabel] = React.useState({ value: '', valid: false });

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

  return (
    <Box className="profile" p={3}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" mb={4}><Trans>profile.title</Trans></Typography>

        {/* User Info */}
        <Grid2 container spacing={2} alignItems="center" justifyContent="center" mb={4}>
          <Grid2 size={{
            xs: 12,
            sm: 4
          }} textAlign="center">
            <Typography><Trans>profile.code</Trans>{context.code}</Typography>
          </Grid2>
          <Grid2 size={{
            xs: 12,
            sm: 4
          }}
            textAlign="center">
            <Typography><Trans>profile.name_first</Trans>{context.name_first}</Typography>
          </Grid2>
          <Grid2 size={{
            xs: 12,
            sm: 4
          }} textAlign="center">
            <Typography><Trans>profile.name_last</Trans>{context.name_last}</Typography>
          </Grid2>
        </Grid2>

        <Divider sx={{ my: 2 }}>
          <Chip label={<Trans>profile.password</Trans>} />
        </Divider>

        {/* Change Password */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={50} />
          </Box>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <Grid2 container spacing={2}>
              <Grid2 size={{
                xs: 12,
                sm: 4
              }}>
                <Input
                  label={<Trans>profile.oldPassword</Trans>}
                  tooltip={<Trans>REGEX.PASSWORD</Trans>}
                  regex=".{6,}"
                  type="password"
                  entity={formEntities.old}
                  onChange={(entity: any) => setFormEntities(prev => ({ ...prev, old: entity }))}
                  icons={icons}
                  require
                  virgin
                />
              </Grid2>
              <Grid2 size={{
                xs: 12,
                sm: 4
              }}>
                <Input
                  label={<Trans>profile.newPassword</Trans>}
                  tooltip={<Trans>REGEX.PASSWORD</Trans>}
                  regex=".{6,}"
                  type="password"
                  entity={formEntities.new}
                  onChange={(entity: any) => setFormEntities(prev => ({ ...prev, new: entity }))}
                  icons={icons}
                  require
                  virgin
                />
              </Grid2>
              <Grid2 size={{
                xs: 12,
                sm: 4
              }}>
                <Input
                  label={<Trans>profile.confPassword</Trans>}
                  tooltip={<Trans>REGEX.PASSWORD</Trans>}
                  regex=".{6,}"
                  type="password"
                  entity={formEntities.conf}
                  onChange={(entity: any) => setFormEntities(prev => ({ ...prev, conf: entity }))}
                  icons={icons}
                  require
                  virgin
                />
              </Grid2>
              {error && (
                <Grid2 size={{
                  xs: 12,
                  sm: 4
                }}>
                  <Typography color="error" textAlign="center"><Trans>profile.{error}</Trans></Typography>
                </Grid2>
              )}
              <Grid2 size={{
                xs: 12,
                sm: 4
              }} textAlign="center">
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

        <Divider sx={{ my: 4 }}>
          <Chip label={<Trans>profile.settings</Trans>} />
        </Divider>

        {/* Volume */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1">
            <Trans>profile.volumeControl</Trans>: {Math.round((contextStore.volume ?? 1) * 100)}%
          </Typography>
          <Slider
            value={contextStore.volume ?? 1}
            min={0}
            max={1}
            step={0.1}
            onChange={(_, newValue) => contextStore.setState({ volume: newValue })}
            valueLabelDisplay="auto"
            sx={{ width: '80%', mt: 2 }}
          />
        </Box>

        <Divider sx={{ my: 4 }}>
          <Chip label={<Trans>profile.passkeys</Trans>} />
        </Divider>

        {/* Passkey Management */}
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
          <Input
            label={<Trans>profile.passkey_label</Trans>}
            tooltip={<Trans>REGEX.PASSKEY_LABEL</Trans>}
            regex=".{3,}"
            entity={passkeyLabel}
            onChange={(entity: any) => setPasskeyLabel(entity)}
            icons={icons}
            require
            virgin
          />
          <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
          <IconButton
            color="primary"
            disabled={!passkeyLabel.valid}
            title={t('profile.add_passkey')}
          >
            {icons.add}
          </IconButton>
        </Paper>

        <Box textAlign="center">
          <Link href="ms-settings:savedpasskeys" underline="hover">
            <Trans>profile.keys</Trans>
          </Link>
        </Box>

      </motion.div>
    </Box>
  );
};