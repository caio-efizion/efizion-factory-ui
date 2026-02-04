import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SendIcon from '@mui/icons-material/Send';
import { useSnackbar } from 'notistack';
import { createTask } from '../services/taskService';

interface TaskFormData {
  title: string;
  description: string;
}

interface TaskFormErrors {
  title?: string;
  description?: string;
}

/**
 * Formulário de criação de tarefas com validação robusta
 * - Validação em tempo real
 * - Feedback visual claro
 * - Acessibilidade completa (ARIA labels, keyboard navigation)
 * - Tooltips informativos
 */
export const TaskFormEnhanced: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ title: false, description: false });

  const validateField = (name: keyof TaskFormData, value: string): string | undefined => {
    if (name === 'title') {
      if (!value.trim()) return 'Título é obrigatório';
      if (value.length < 3) return 'Título deve ter pelo menos 3 caracteres';
      if (value.length > 100) return 'Título não pode exceder 100 caracteres';
    }

    if (name === 'description') {
      if (!value.trim()) return 'Descrição é obrigatória';
      const repoRegex = /(https:\/\/github\.com\/[\w\-]+\/[\w\-\.]+)/i;
      if (!repoRegex.test(value)) {
        return 'Descrição deve conter uma URL válida do GitHub (ex: https://github.com/user/repo)';
      }
    }

    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar em tempo real apenas se o campo já foi tocado
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name as keyof TaskFormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof TaskFormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const titleError = validateField('title', formData.title);
    const descriptionError = validateField('description', formData.description);

    setErrors({
      title: titleError,
      description: descriptionError,
    });

    setTouched({ title: true, description: true });

    return !titleError && !descriptionError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      enqueueSnackbar('Por favor, corrija os erros no formulário', { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      await createTask(formData);
      enqueueSnackbar('Tarefa criada com sucesso!', { variant: 'success' });
      
      // Reset form
      setFormData({ title: '', description: '' });
      setErrors({});
      setTouched({ title: false, description: false });
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || 'Falha ao criar tarefa';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Typography variant="h5" component="h1">
          Nova Tarefa
        </Typography>
        <Tooltip title="Crie tarefas de automação vinculadas a repositórios GitHub">
          <IconButton size="small" aria-label="Ajuda sobre criação de tarefas">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        As tarefas executam ações automatizadas em repositórios GitHub.
        Certifique-se de incluir a URL completa do repositório.
      </Alert>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          required
          id="title"
          name="title"
          label="Título da Tarefa"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && !!errors.title}
          helperText={touched.title && errors.title}
          disabled={loading}
          placeholder="Ex: Deploy do serviço de autenticação"
          sx={{ mb: 3 }}
          inputProps={{
            'aria-label': 'Título da tarefa',
            'aria-required': 'true',
            'aria-invalid': touched.title && !!errors.title,
            'aria-describedby': errors.title ? 'title-error' : undefined,
          }}
        />

        <TextField
          fullWidth
          required
          multiline
          rows={4}
          id="description"
          name="description"
          label="Descrição"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && !!errors.description}
          helperText={touched.description && errors.description}
          disabled={loading}
          placeholder="Ex: Realizar deploy do microserviço em https://github.com/org/auth-service"
          sx={{ mb: 3 }}
          inputProps={{
            'aria-label': 'Descrição da tarefa',
            'aria-required': 'true',
            'aria-invalid': touched.description && !!errors.description,
            'aria-describedby': errors.description ? 'description-error' : undefined,
          }}
        />

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => {
              setFormData({ title: '', description: '' });
              setErrors({});
              setTouched({ title: false, description: false });
            }}
            disabled={loading}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            aria-label="Criar tarefa"
          >
            {loading ? 'Criando...' : 'Criar Tarefa'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskFormEnhanced;
