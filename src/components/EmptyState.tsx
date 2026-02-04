import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export interface EmptyStateProps {
  /** Título do estado vazio */
  title: string;
  /** Descrição/mensagem explicativa */
  description?: string;
  /** Ícone customizado (componente React) */
  icon?: React.ReactNode;
  /** Texto do botão de ação */
  actionLabel?: string;
  /** Callback quando o botão de ação é clicado */
  onAction?: () => void;
  /** Texto alternativo do ícone para acessibilidade */
  iconAriaLabel?: string;
}

/**
 * Componente de estado vazio acessível e informativo
 * Usado quando listas ou seções não possuem dados para exibir
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   title="Nenhuma tarefa encontrada"
 *   description="Comece criando sua primeira tarefa para automação"
 *   actionLabel="Nova Tarefa"
 *   onAction={() => router.push('/tasks/new')}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  iconAriaLabel = 'Estado vazio',
}) => {
  const defaultIcon = icon || (
    <InboxIcon
      sx={{ fontSize: 80, color: 'text.disabled' }}
      aria-label={iconAriaLabel}
    />
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py={8}
      px={3}
      role="status"
      aria-live="polite"
    >
      {defaultIcon}
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ mt: 2 }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400 }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onAction}
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
