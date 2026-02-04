import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Task } from '../types';

export interface TaskCardProps {
  /** Dados completos da tarefa */
  task: Task;
  /** Callback para visualizar detalhes */
  onView?: () => void;
  /** Callback para executar tarefa */
  onRun?: () => void;
  /** Callback para excluir tarefa */
  onDelete?: () => void;
}

/**
 * Card de tarefa com design moderno e acessível
 * - Status visual com cores semânticas
 * - Ações quick-access
 * - Informações principais destacadas
 * - Responsivo e touch-friendly
 * 
 * @example
 * ```tsx
 * <TaskCard
 *   task={task}
 *   onView={() => router.push(`/tasks/${task.id}`)}
 *   onDelete={() => handleDelete(task.id)}
 * />
 * ```
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onView, onRun, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'success';
      case 'running':
        return 'info';
      case 'error':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done':
        return 'Concluído';
      case 'running':
        return 'Em execução';
      case 'error':
        return 'Erro';
      case 'pending':
      default:
        return 'Pendente';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Não disponível';
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      role="article"
      aria-label={`Tarefa: ${task.title}`}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.title}
          </Typography>
          <Chip
            label={getStatusLabel(task.status)}
            color={getStatusColor(task.status) as any}
            size="small"
            aria-label={`Status: ${getStatusLabel(task.status)}`}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {task.description || 'Sem descrição'}
        </Typography>

        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
          <AccessTimeIcon fontSize="small" />
          <Typography variant="caption">{formatDate(task.createdAt)}</Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box display="flex" gap={1}>
          {onView && (
            <Tooltip title="Ver detalhes">
              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={onView}
                aria-label={`Ver detalhes de ${task.title}`}
              >
                Detalhes
              </Button>
            </Tooltip>
          )}
          {onRun && task.status === 'pending' && (
            <Tooltip title="Executar tarefa">
              <IconButton
                size="small"
                color="primary"
                onClick={onRun}
                aria-label={`Executar ${task.title}`}
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {onDelete && (
          <Tooltip title="Excluir tarefa">
            <IconButton
              size="small"
              color="error"
              onClick={onDelete}
              aria-label={`Excluir ${task.title}`}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default TaskCard;
