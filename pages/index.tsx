
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from '../src/components/layout/Header';
import Sidebar from '../src/components/layout/Sidebar';
import Main from '../src/components/layout/Main';
import TaskCard from '../src/components/TaskCard';
import LoadingOverlay from '../src/components/LoadingOverlay';
import StatusBadge from '../src/components/StatusBadge';

const mockTasks = [
  { id: 1, name: 'Tarefa 1', status: 'pending' },
  { id: 2, name: 'Tarefa 2', status: 'done' },
  { id: 3, name: 'Tarefa 3', status: 'error' },
];

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ef6c00' },
  },
});

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock loading and error for demo
  // setLoading(true); setTimeout(() => setLoading(false), 1000);
  // setError('Erro ao carregar tarefas');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Main>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Efizion Factory UI
          </Typography>
          {loading && <LoadingOverlay />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && mockTasks.length === 0 && (
            <Alert severity="info">Nenhuma tarefa encontrada.</Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mockTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                name={task.name}
                status={task.status}
                onSelect={setSelectedTask}
              />
            ))}
          </Box>
          {selectedTask && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Tarefa selecionada: {selectedTask}</Typography>
              <StatusBadge status={mockTasks.find(t => t.id === selectedTask)?.status} />
            </Box>
          )}
        </Container>
      </Main>
    </ThemeProvider>
  );
}
