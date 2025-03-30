// src/components/pages/PageNotFound.tsx
import React from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      px={2}
    >
      <Typography variant="h1" color="text.secondary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" color="text.secondary" gutterBottom>
        <Trans>not_found.oups</Trans>
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        <Trans>not_found.help</Trans>
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
      >
        <Trans>not_found.back_home</Trans>
      </Button>
    </Box>
  );
};
