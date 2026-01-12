import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function SettingsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1">Página de configurações em construção. Em breve você poderá ajustar preferências, integrações e parâmetros do Efizion Factory.</Typography>
      </Box>
    </Container>
  );
}
