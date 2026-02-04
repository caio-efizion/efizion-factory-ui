import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface KPIs {
  totalProjects: number;
  activeProjects: number;
  totalJobs: number;
  successJobs: number;
  failedJobs: number;
  activeAgents: number;
}

export default function KPIDashboard({ kpis }: { kpis: KPIs }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#1976d2' }}>Painel de KPIs</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6">Projetos</Typography>
              <Typography variant="h4">{kpis.totalProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: '#c8e6c9' }}>
            <CardContent>
              <Typography variant="h6">Ativos</Typography>
              <Typography variant="h4">{kpis.activeProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: '#fff9c4' }}>
            <CardContent>
              <Typography variant="h6">Jobs</Typography>
              <Typography variant="h4">{kpis.totalJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: '#b2dfdb' }}>
            <CardContent>
              <Typography variant="h6">Sucesso</Typography>
              <Typography variant="h4">{kpis.successJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: '#ffcdd2' }}>
            <CardContent>
              <Typography variant="h6">Falhas</Typography>
              <Typography variant="h4">{kpis.failedJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: '#d1c4e9' }}>
            <CardContent>
              <Typography variant="h6">Agentes Ativos</Typography>
              <Typography variant="h4">{kpis.activeAgents}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
