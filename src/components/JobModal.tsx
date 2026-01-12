import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  job: {
    id: string;
    name: string;
    status: string;
    logs: string[];
  } | null;
}

export default function JobModal({ open, onClose, job }: JobModalProps) {
  if (!job) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-label="Modal de detalhes do job" tabIndex={0}>
      <DialogTitle tabIndex={0} aria-label="Título do modal de job" sx={{ bgcolor: '#212121', color: '#fff' }}>Detalhes do Job</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`ID do job: ${job.id}`}>ID: {job.id}</Typography>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`Nome do job: ${job.name}`}>Nome: {job.name}</Typography>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`Status do job: ${job.status}`}>Status: {job.status}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }} tabIndex={0} aria-label="Logs do job">Logs</Typography>
        <pre
          style={{ background: '#212121', color: '#fff', padding: 8, borderRadius: 4, maxHeight: 200, overflow: 'auto', fontSize: 14 }}
          aria-label="Área de logs do job"
          tabIndex={0}
        >
          {job.logs.join('\n')}
        </pre>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" aria-label="Fechar modal de job" tabIndex={0} sx={{ bgcolor: '#1976d2', color: '#fff' }}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
