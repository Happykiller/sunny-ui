// src/components/LayoutPublic.tsx
import type { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';

export interface LayoutPublicProps {
  footer: ReactNode;
  children: ReactNode;
}

export function LayoutPublic({ footer, children }: LayoutPublicProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: theme.palette.background.default,
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, ${theme.palette.primary.main}40 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, #1B1F3B 100%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 1, md: 4 },
            py: { xs: 2, md: 4 },
          }}
        >
          {children}
        </Container>
      </Box>

      <Box component="footer">
        {footer}
      </Box>
    </Box>
  );
}
