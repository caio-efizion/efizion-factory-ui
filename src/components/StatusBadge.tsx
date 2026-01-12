
import React from 'react';
import Chip from '@mui/material/Chip';

export default function StatusBadge({ status }: { status?: string }) {
  let color: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
  switch (status) {
    case 'done':
      color = 'success';
      break;
    case 'pending':
      color = 'warning';
      break;
    case 'error':
      color = 'error';
      break;
    default:
      color = 'default';
  }
  return (
    <Chip
      label={status || 'Indefinido'}
      color={color}
      size="small"
      aria-label={`Status da tarefa: ${status || 'Indefinido'}`}
      tabIndex={0}
      sx={{ bgcolor: color === 'success' ? '#388e3c' : color === 'error' ? '#d32f2f' : color === 'warning' ? '#fbc02d' : '#757575', color: '#fff' }}
    />
  );
}
