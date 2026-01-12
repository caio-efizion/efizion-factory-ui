import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface AgentModalProps {
  open: boolean;
  onClose: () => void;
  agent: {
    id: string;
    name: string;
    status: string;
    lastJob: string;
  } | null;
}

export default function AgentModal({ open, onClose, agent }: AgentModalProps) {
  if (!agent) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-label="Modal de detalhes do agente" tabIndex={0}>
      <DialogTitle tabIndex={0} aria-label="Título do modal de agente" sx={{ bgcolor: '#212121', color: '#fff' }}>Detalhes do Agente</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`ID do agente: ${agent.id}`}>ID: {agent.id}</Typography>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`Nome do agente: ${agent.name}`}>Nome: {agent.name}</Typography>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`Status do agente: ${agent.status}`}>Status: {agent.status}</Typography>
        <Typography variant="subtitle1" tabIndex={0} aria-label={`Último job do agente: ${agent.lastJob}`}>Último Job: {agent.lastJob}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" aria-label="Fechar modal de agente" tabIndex={0} sx={{ bgcolor: '#1976d2', color: '#fff' }}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
