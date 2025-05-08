import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

export interface HeaderContextStore {
  code?: string | null | undefined;
  reset?: () => void;
}

export interface VolatileContextStore {
  fullscreen?: boolean;
}

export interface HeaderProps {
  brandName?: string;
  routes?: string[];
  settings?: string[];
  onLogout?: () => void;
  icons?: {
    menu?: React.ReactNode;
  };
  sx?: any;
  contextStore: HeaderContextStore;
  volatileStore?: VolatileContextStore;
}

export const Header: React.FC<HeaderProps> = ({
  brandName = 'Vergo',
  routes = ['trainings', 'exercices', 'workouts', 'info'],
  settings = ['profile', 'logout'],
  onLogout,
  icons = {},
  sx = {},
  contextStore,
  volatileStore,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? '/logo_dark.png' : '/logo_light.png';

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSettingClick = (setting: string) => {
    if (setting === 'logout') {
      contextStore.reset?.();
      onLogout?.();
      navigate('/login');
    } else {
      navigate(`/${setting}`);
    }
  };

  if (volatileStore?.fullscreen) return null;

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: theme.zIndex.appBar,
        background: theme.palette.background.default,
        backgroundImage: theme.palette.gradient,
        boxShadow: `
          0 0 24px ${theme.palette.primary.main}33,
          0 0 64px ${theme.palette.primary.main}1A,
          inset 0 0 8px rgba(255, 255, 255, 0.02)
        `,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        backdropFilter: 'blur(2px)',
        ...sx,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Brand desktop */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                borderRadius: `${theme.shape.borderRadius}px`,
                overflow: 'hidden',
                boxShadow: `0 0 12px ${theme.palette.primary.main}55`,
                backgroundColor: theme.palette.background.default,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={logoSrc}
                alt={brandName}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>
          </Link>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label={t('header.open_user_menu')}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {icons.menu}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {routes.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    navigate(`/${page}`);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center"><Trans>header.{page}</Trans></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Brand mobile */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Montserrat',
              fontWeight: 700,
              letterSpacing: '0.2rem',
              color: theme.palette.text.primary,
              textDecoration: 'none',
            }}
            component={Link}
            to="/"
          >
            {brandName}
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {routes.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page}`)}
                variant="text"
                sx={{
                  my: 1,
                  mx: 1,
                  fontWeight: 600,
                  fontFamily: 'Montserrat',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    color: theme.palette.primary.light,
                    backgroundColor: 'transparent',
                  }
                }}
              >
                <Trans>header.{page}</Trans>
              </Button>
            ))}
          </Box>

          {/* User avatar + menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={t('header.settings')}>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                aria-label={t('header.open_user_menu')}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    fontWeight: 600,
                    fontFamily: 'Montserrat',
                    border: `1px solid ${theme.palette.primary.light}`,
                    boxShadow: `0 0 8px ${theme.palette.primary.main}55`
                  }}
                  alt={contextStore.code ?? 'U'}
                >
                  {(contextStore.code ?? 'USR').substring(0, 3).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleSettingClick(setting);
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center"><Trans>header.{setting}</Trans></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
