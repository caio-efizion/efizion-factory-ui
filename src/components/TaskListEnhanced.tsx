import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getTasks, deleteTask } from '../services/taskService';
import { Task } from '../types';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import ConfirmDialog from './ConfirmDialog';

/**
 * Lista de tarefas com recursos avançados:
 * - Busca e filtros
 * - Paginação
 * - Ações CRUD com confirmação
 * - Estados de loading/empty/error
 * - Layout responsivo
 */
export const TaskListEnhanced: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setFilteredTasks(data);
      enqueueSnackbar('Tarefas carregadas com sucesso', { variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || 'Erro ao carregar tarefas';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;

    // Filtro de busca
    if (searchQuery) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, tasks]);

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      enqueueSnackbar('Tarefa excluída com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao excluir tarefa', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return tasks.length;
    return tasks.filter((t) => t.status === status).length;
  };

  if (loading) {
    return <LoadingState message="Carregando tarefas..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tarefas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/tasks/new')}
          aria-label="Criar nova tarefa"
        >
          Nova Tarefa
        </Button>
      </Box>

      {/* Filtros e Busca */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            fullWidth
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            aria-label="Buscar tarefas"
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<FilterListIcon sx={{ mr: 1, color: 'action.active' }} />}
            >
              <MenuItem value="all">
                Todos ({getStatusCount('all')})
              </MenuItem>
              <MenuItem value="pending">
                Pendente ({getStatusCount('pending')})
              </MenuItem>
              <MenuItem value="running">
                Em execução ({getStatusCount('running')})
              </MenuItem>
              <MenuItem value="done">
                Concluído ({getStatusCount('done')})
              </MenuItem>
              <MenuItem value="error">
                Erro ({getStatusCount('error')})
              </MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Atualizar lista">
            <IconButton onClick={fetchTasks} aria-label="Atualizar tarefas">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Lista de Tarefas */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title={searchQuery || statusFilter !== 'all' ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa criada'}
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira tarefa de automação'
          }
          actionLabel={!searchQuery && statusFilter === 'all' ? 'Criar Primeira Tarefa' : undefined}
          onAction={!searchQuery && statusFilter === 'all' ? () => router.push('/tasks/new') : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={task.id}>
              <TaskCard
                task={task}
                onDelete={() => handleDeleteClick(task.id)}
                onView={() => router.push(`/tasks/${task.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        showWarningIcon
      />
    </Box>
  );
};

export default TaskListEnhanced;
