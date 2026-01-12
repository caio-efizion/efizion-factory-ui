import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function TasksPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tarefas
        </Typography>
        <Typography variant="body1">Página de tarefas em construção. Em breve você poderá visualizar, filtrar e gerenciar todas as tarefas da Efizion Factory.</Typography>
      </Box>
    </Container>
  );
}
