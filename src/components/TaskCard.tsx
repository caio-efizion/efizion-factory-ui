
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StatusBadge from './StatusBadge';

interface TaskCardProps {
  id: string | number;
  name: string;
  status?: string;
  onSelect?: (id: string | number) => void;
}

export default function TaskCard({ id, name, status, onSelect }: TaskCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <StatusBadge status={status} />
        <Button
          variant="contained"
          sx={{ mt: 1, bgcolor: '#1976d2', color: '#fff', '&:focus': { outline: '2px solid #1976d2' } }}
          onClick={() => onSelect && onSelect(id)}
          aria-label={`Ver detalhes da tarefa ${name}`}
          tabIndex={0}
        >
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
