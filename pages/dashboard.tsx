import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Mock API fetch (substitua por chamada real)
const fetchDashboardData = async () => {
  return {
    totalTasks: 42,
    activeJobs: 7,
    successJobs: 30,
    failedJobs: 5,
    agentsOnline: 3,
    tasksByStatus: [
      { status: 'Sucesso', value: 30 },
      { status: 'Falha', value: 5 },
      { status: 'Ativo', value: 7 },
    ],
    jobsPerformance: [
      { name: 'Seg', jobs: 10 },
      { name: 'Ter', jobs: 12 },
      { name: 'Qua', jobs: 8 },
      { name: 'Qui', jobs: 6 },
      { name: 'Sex', jobs: 6 },
    ],
  };
};

const COLORS = ['#4caf50', '#f44336', '#2196f3'];

function DashboardContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    fetchDashboardData().then((res) => {
      setData(res);
      setLoading(false);
      enqueueSnackbar('Dashboard carregado com sucesso!', { variant: 'success' });
    });
  }, [enqueueSnackbar]);

  if (loading || !data) {
    return <Typography variant="h6">Carregando dashboard...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Cards de status */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tarefas</Typography>
              <Typography variant="h4">{data.totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Jobs Ativos</Typography>
              <Typography variant="h4">{data.activeJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sucesso</Typography>
              <Typography variant="h4" color="success.main">{data.successJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Falha</Typography>
              <Typography variant="h4" color="error.main">{data.failedJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Gráfico de pizza: tarefas por status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tarefas por Status</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.tasksByStatus} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                    {data.tasksByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Gráfico de barras: performance dos jobs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Performance dos Jobs</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.jobsPerformance}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jobs" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Card de agentes online */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Agentes Online</Typography>
              <Typography variant="h4" color="primary.main">{data.agentsOnline}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Filtros e ações */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <Button variant="contained">Filtrar por período</Button>
            <Button variant="outlined">Filtrar por status</Button>
            <Button variant="outlined">Filtrar por responsável</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <DashboardContent />
    </SnackbarProvider>
  );
}
