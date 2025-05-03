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
  };
  onToggleTheme?: () => void;
  themeMode?: 'light' | 'dark';
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
  themeMode,
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
      <Typography variant="body2" component="span">{brandName}</Typography>

      <Link href={`mailto:${mailto}`} underline="hover" sx={iconStyle}>{icons?.email}</Link>

      <Typography variant="body2" component="span">
        <Trans>footer.version.front</Trans> {frontVersion}
      </Typography>

      <Typography variant="body2" component="span">
        <Trans>footer.version.back</Trans> <Trans>{backVersion}</Trans>
      </Typography>

      <Link href={issuesUrl} target="_blank" rel="noopener noreferrer" underline="hover" sx={iconStyle}>
        {icons?.issues}
      </Link>

      <Link href={projectUrl} target="_blank" rel="noopener noreferrer" underline="hover" sx={iconStyle}>
        {icons?.roadmap}
      </Link>

      <Link
        component={RouterLink}
        to="/cgu"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
      >
        CGU
      </Link>

      {onToggleTheme && iconThemeToggle && (
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
      )}
    </Box>
  );
};
