// src/components/pages/Profile.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { client, utils } from '@passwordless-id/webauthn';
import { Trans, useTranslation } from 'react-i18next';
import { RegisterOptions, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';
import { Box, Button, CircularProgress, Typography, Divider, Chip, Slider, IconButton, Paper, Link, Grid, useTheme } from '@mui/material';

import { Input } from '@components/Input';
import { ProfilePageProps } from './Profile.types';
import { useFlashStore } from '@hooks/useFlashStore';

export const Profile: React.FC<ProfilePageProps> = ({ icons, services, contextStore }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const context = contextStore();
  const flashStore = useFlashStore();
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
      /**
       * Le serveur émet le challenge — qui ne sert qu'une fois — et donne le
       * `user_handle` du compte. Ces deux valeurs venaient du navigateur : le
       * challenge était donc vérifié contre lui-même, et le handle changeait à
       * chaque clé, si bien qu'aucune assertion ne permettait de remonter au
       * compte.
       */
      const options = await services.passkeyRegisterOptionsUsecase.execute();
      if (options.message !== 'SUCCESS' || !options.data) {
        throw new Error(options.error ?? options.message);
      }
      const { challenge, user_handle, exclude_credentials } = options.data;

      const formattedDate = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
      const passkey_display = `${context.code} (${passkeyLabel.value} - ${formattedDate})`;

      /**
       * Ask device passkey auth
       */
      const registerOptions: RegisterOptions = {
        /**
         * `id` stable et opaque : c'est lui que l'authentificateur renverra en
         * `userHandle`, et sous lequel le gestionnaire de mots de passe range
         * le compte. Passer une simple chaîne laissait la bibliothèque en
         * inventer un nouveau à chaque enregistrement.
         */
        user: {
          id: user_handle,
          name: context.code,
          displayName: passkey_display,
        },
        challenge: challenge,
        userVerification: "required",
        /**
         * `required` et non `preferred` : une passkey synchronisée est
         * nécessairement découvrable, et c'est la découvrabilité qui permet de
         * se connecter depuis un poste qui ne connaît pas encore le compte. En
         * `preferred`, l'authentificateur restait libre de créer une credential
         * que le navigateur ne proposerait jamais de lui-même.
         */
        discoverable: "required",
        timeout: 60000,
        /**
         * L'attestation n'était pas exploitée à la vérification, et les
         * recommandations passkeys.dev déconseillent de la demander : elle
         * ajoute de la friction sans rien apporter ici.
         */
        attestation: false,
        ...(exclude_credentials.length > 0 && {
          // Sans cette liste, relancer l'enregistrement chez le même
          // fournisseur y empile des clés en double, toutes valides et
          // indiscernables pour l'utilisateur.
          customProperties: {
            // `customProperties` est fusionné tel quel dans les options
            // WebAuthn : l'identifiant doit donc être un BufferSource, pas la
            // chaîne base64url que suggère l'exemple de la bibliothèque. Passée
            // en chaîne, la cérémonie échoue avant même d'atteindre
            // l'authentificateur.
            excludeCredentials: exclude_credentials.map((id) => ({
              id: utils.parseBase64url(id),
              type: 'public-key',
            })),
          },
        }),
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

  React.useEffect(() => {
    loadPasskeys();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 0, sm: 4 },
        backgroundColor: { xs: 'transparent', sm: theme.palette.background.default },
        boxShadow: {
          xs: 'none',
          sm: `0 0 24px ${theme.palette.primary.main}33,
           0 0 64px ${theme.palette.primary.main}1A,
           inset 0 0 8px rgba(255, 255, 255, 0.02)`,
        },
        border: {
          xs: 'none',
          sm: `1px solid ${theme.palette.primary.main}`,
        },
        borderRadius: `${theme.shape.borderRadius}px`,
        backdropFilter: { xs: 'none', sm: 'blur(2px)' },
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 4 }}>
          <Trans>profile.title</Trans>
        </Typography>

        {/* User Info */}
        <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: 'center' }}>
            <Typography><Trans>profile.code</Trans> {context.code}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: 'center' }}>
            <Typography><Trans>profile.name_first</Trans> {context.name_first}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: 'center' }}>
            <Typography><Trans>profile.name_last</Trans> {context.name_last}</Typography>
          </Grid>
        </Grid>

        {/* Password Section */}
        <Divider sx={{ my: { xs: 2, sm: 4 } }}>
          <Chip label={<Trans>profile.password</Trans>} />
        </Divider>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <form onSubmit={handlePasswordUpdate}>
            <Grid container spacing={2}>
              {['old', 'new', 'conf'].map((field, idx) => (
                <Grid key={field} size={{ xs: 12, sm: 4 }}>
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
                </Grid>
              ))}
              {error && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error" sx={{ textAlign: 'center' }}><Trans>profile.{error}</Trans></Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={icons.done}
                  disabled={!formIsValid}
                >
                  <Trans>common.done</Trans>
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {/* Volume Section */}
        <Divider sx={{ my: { xs: 2, sm: 4 } }}>
          <Chip label={<Trans>profile.settings</Trans>} />
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <Divider sx={{ my: { xs: 2, sm: 4 } }}>
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
          <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>
        ) : errorPasskeys ? (
          <Typography color="error" sx={{ textAlign: 'center' }}><Trans>profile.passkey_list_error</Trans></Typography>
        ) : passkeys.length === 0 ? (
          <Typography sx={{ textAlign: 'center' }}><Trans>profile.no_passkeys</Trans></Typography>
        ) : (
          passkeys.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap>{p.label}</Typography>
                  {/*
                    Le libellé seul ne dit plus rien d'utile : « PC du bureau »
                    est trompeur quand la clé vit dans un gestionnaire
                    synchronisé, et l'utilisateur ne peut pas deviner laquelle
                    il perdrait avec son appareil. Ces deux informations
                    viennent du relevé d'enregistrement — elles ne coûtent ni
                    colonne ni appel supplémentaire.
                  */}
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {p.authenticator_name ?? t('profile.passkey.unknown_provider')}
                    {' \u00b7 '}
                    {p.synced
                      ? t('profile.passkey.synced')
                      : t('profile.passkey.device_only')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton title={t('profile.passkey.table.delete')} onClick={() => handleDeletePasskey(p.id)}>
                    {icons.delete}
                  </IconButton>
                </Box>
              </Paper>
            </motion.div>
          ))
        )}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link href="ms-settings:savedpasskeys" underline="hover">
            <Trans>profile.keys</Trans>
          </Link>
        </Box>

      </motion.div>
    </Paper>
  );
};
