// src/components/Footer.tsx
import { Trans } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Link,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';

export interface FooterProps {
  systemInfoUsecase: any;
  frontVersion?: string;
  issuesUrl?: string;
  projectUrl?: string;
  mailto?: string;
  brandName?: string;
  icons?: {
    email?: React.ReactNode;
    issues?: React.ReactNode;
    roadmap?: React.ReactNode;
    language?: React.ReactNode;
    cloud?: React.ReactNode;
  };
  onToggleTheme?: () => void;
  iconThemeToggle?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
  systemInfoUsecase,
  frontVersion,
  issuesUrl,
  projectUrl,
  mailto,
  brandName,
  icons,
  onToggleTheme,
  iconThemeToggle,
}) => {
  const [backVersion, setBackVersion] = useState<string>('common.loading');
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    if (!systemInfoUsecase) {
      setBackVersion('N/A');
      return;
    }

    systemInfoUsecase.execute()
      .then((response: any) => {
        if (!isMounted) return;
        if (response.message === 'SUCCESS' && response.data) {
          setBackVersion(response.data.version);
        } else {
          setBackVersion('N/A');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setBackVersion('N/A');
      });

    return () => { isMounted = false };
  }, [systemInfoUsecase]);

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        fontSize: { xs: '8px', sm: '12px', md: '14px' },
        py: 0.5,
        px: 2,
        color: theme.palette.text.secondary,
        zIndex: theme.zIndex.appBar - 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="body2" component="span">
        {brandName}
      </Typography>

      <Tooltip title={<Trans>footer.email</Trans>}>
        <Link href={`mailto:${mailto}`} underline="hover" sx={iconStyle}>
          {icons?.email}
        </Link>
      </Tooltip>

      <Tooltip title={<Trans>footer.front</Trans>}>
        <Typography variant="body2" component="span" sx={iconStyle}>
          {icons?.language} {frontVersion}
        </Typography>
      </Tooltip>

      <Tooltip title={<Trans>footer.back</Trans>}>
        <Typography variant="body2" component="span" sx={iconStyle}>
          {icons?.cloud} {backVersion}
        </Typography>
      </Tooltip>

      <Tooltip title={<Trans>footer.issues</Trans>}>
        <Link href={issuesUrl} target="_blank" rel="noopener noreferrer" underline="hover" sx={iconStyle}>
          {icons?.issues}
        </Link>
      </Tooltip>

      <Tooltip title={<Trans>footer.roadmap</Trans>}>
        <Link href={projectUrl} target="_blank" rel="noopener noreferrer" underline="hover" sx={iconStyle}>
          {icons?.roadmap}
        </Link>
      </Tooltip>

      <Tooltip title={<Trans>footer.cgu</Trans>}>
        <Link
          component={RouterLink}
          to="/cgu"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          CGU
        </Link>
      </Tooltip>

      {onToggleTheme && iconThemeToggle && (
        <Tooltip title={<Trans>footer.toggle_theme</Trans>}>
          <IconButton
            onClick={onToggleTheme}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                color: theme.palette.primary.light,
              }
            }}
          >
            {iconThemeToggle}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
