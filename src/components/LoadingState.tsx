import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop,
} from '@mui/material';

export interface LoadingStateProps {
  /** Mensagem de carregamento */
  message?: string;
  /** Se true, exibe um backdrop (overlay escuro) */
  fullScreen?: boolean;
  /** Tamanho do spinner */
  size?: number;
}

/**
 * Componente de estado de carregamento acessível
 * Pode ser usado inline ou como fullscreen overlay
 * 
 * @example
 * ```tsx
 * // Inline
 * <LoadingState message="Carregando tarefas..." />
 * 
 * // Full screen
 * <LoadingState fullScreen message="Processando..." />
 * ```
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  fullScreen = false,
  size = 40,
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      py={fullScreen ? 0 : 4}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CircularProgress size={size} aria-label="Carregando" />
      <Typography variant="body2" color="text.secondary" aria-live="polite">
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        {content}
      </Backdrop>
    );
  }

  return content;
};

export default LoadingState;
