import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import theme from '../src/theme';
import TaskListEnhanced from '../src/components/TaskListEnhanced';
import OnboardingTour from '../src/components/OnboardingTour';
import KPIDashboard from '../src/components/KPIDashboard';

const mockKPIs = {
  totalProjects: 10,
  activeProjects: 5,
  totalJobs: 50,
  successJobs: 40,
  failedJobs: 5,
  activeAgents: 3,
};

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              Efizion Factory UI
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Plataforma de automação e gerenciamento de tarefas
            </Typography>
          </Box>

          <KPIDashboard kpis={mockKPIs} />
          
          <Box sx={{ mt: 4 }}>
            <TaskListEnhanced />
          </Box>
        </Container>
        
        <OnboardingTour autoStart={false} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
