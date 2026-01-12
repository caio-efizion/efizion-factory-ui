import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

interface LogViewerProps {
  logs: string[];
  loading?: boolean;
  error?: string | null;
}

export default function LogViewer({ logs, loading, error }: LogViewerProps) {
  const [filter, setFilter] = React.useState('');
  const filteredLogs = logs.filter(log => log.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" component="h2" tabIndex={0} aria-label="Logs em tempo real" sx={{ color: '#1976d2' }}>
        Logs em tempo real
      </Typography>
      <TextField
        label="Filtrar logs"
        variant="outlined"
        size="small"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        sx={{ mb: 2 }}
        inputProps={{ 'aria-label': 'Filtrar logs', tabIndex: 0 }}
      />
      {loading && <CircularProgress aria-label="Carregando logs" />}
      {error && <Typography color="error" aria-label="Erro nos logs" tabIndex={0}>{error}</Typography>}
      <pre
        style={{ background: '#212121', color: '#fff', padding: 8, borderRadius: 4, maxHeight: 300, overflow: 'auto', fontSize: 14 }}
        aria-label="Área de logs"
        tabIndex={0}
      >
        {filteredLogs.join('\n')}
      </pre>
    </Box>
  );
}
