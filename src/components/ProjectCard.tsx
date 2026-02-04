import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface ProjectCardProps {
  id: string | number;
  name: string;
  repo: string;
  status: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
}

export default function ProjectCard({ id, name, repo, status, onView, onEdit, onDelete, onApprove }: ProjectCardProps) {
  return (
    <Card sx={{ mb: 2, bgcolor: '#f5f5f5', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#1976d2' }}>{name}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>Repositório: <a href={repo} target="_blank" rel="noopener noreferrer">{repo}</a></Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>Status: <b>{status}</b></Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary" onClick={onView}>Visualizar</Button>
          <Button variant="outlined" color="secondary" onClick={onEdit}>Editar</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>Deletar</Button>
          <Button variant="contained" color="success" onClick={onApprove}>Aprovar</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
