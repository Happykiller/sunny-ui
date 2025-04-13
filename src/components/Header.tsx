// src/components/Header.tsx
import React from 'react';
import {
  AppBar, Avatar, Box, Button, Container, IconButton,
  Menu, MenuItem, Toolbar, Tooltip, Typography
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import './header.scss';

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
      if (!contextStore.reset) console.warn('[Header] reset() is undefined');
      contextStore.reset?.();
      onLogout?.();
      navigate('/login');
    } else {
      navigate(`/${setting}`);
    }
  };

  if (volatileStore?.fullscreen) return null;

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3C4042', ...sx }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Brand name desktop */}
          <Typography variant="h6" noWrap sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <Link to="/" className='sunny_header_title'>{brandName}</Link>
          </Typography>

          {/* Mobile menu button */}
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
                <MenuItem key={page} onClick={() => { navigate(`/${page}`); handleCloseNavMenu(); }}>
                  <Typography textAlign="center"><Trans>header.{page}</Trans></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Brand name mobile */}
          <Typography variant="h5" noWrap sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <Link to="/" className='sunny_header_title'>{brandName}</Link>
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {routes.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page}`)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Trans>header.{page}</Trans>
              </Button>
            ))}
          </Box>

          {/* Avatar + settings */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={t('header.settings')}>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                aria-label={t('header.open_user_menu')}
              >
                <Avatar sx={{ backgroundColor: "#EA80FC" }} alt={contextStore.code ?? 'U'}>
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
                <MenuItem key={setting} onClick={() => { handleSettingClick(setting); handleCloseUserMenu(); }}>
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
