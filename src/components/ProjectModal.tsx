import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; repo: string }) => void;
}

export default function ProjectModal({ open, onClose, onSubmit }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [repo, setRepo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name || !repo || !/^https:\/\/github\.com\/.+/.test(repo)) {
      setError('Preencha o nome e uma URL válida do repositório GitHub.');
      return;
    }
    setError(null);
    onSubmit({ name, repo });
    setName('');
    setRepo('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-label="Modal de novo projeto">
      <DialogTitle>Iniciar Novo Projeto</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome do Projeto"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="URL do Repositório GitHub"
          fullWidth
          value={repo}
          onChange={e => setRepo(e.target.value)}
          margin="normal"
          required
        />
        {error && <div style={{ color: '#d32f2f', marginTop: 8 }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Criar Projeto</Button>
      </DialogActions>
    </Dialog>
  );
}
