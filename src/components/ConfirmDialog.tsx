import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box } from '@mui/material';

export interface ConfirmDialogProps {
  /** Controla se o diálogo está aberto */
  open: boolean;
  /** Título do diálogo */
  title: string;
  /** Mensagem de confirmação */
  message: string;
  /** Texto do botão de confirmação */
  confirmText?: string;
  /** Texto do botão de cancelamento */
  cancelText?: string;
  /** Cor do botão de confirmação - 'primary' | 'error' | 'warning' */
  confirmColor?: 'primary' | 'error' | 'warning';
  /** Callback quando o usuário confirma */
  onConfirm: () => void;
  /** Callback quando o usuário cancela */
  onCancel: () => void;
  /** Se true, mostra ícone de aviso */
  showWarningIcon?: boolean;
}

/**
 * Componente de diálogo de confirmação acessível
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={open}
 *   title="Excluir Tarefa"
 *   message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
 *   confirmText="Excluir"
 *   confirmColor="error"
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpen(false)}
 *   showWarningIcon
 * />
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  showWarningIcon = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title">
        {showWarningIcon && (
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmberIcon color="warning" />
            {title}
          </Box>
        )}
        {!showWarningIcon && title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          aria-label={cancelText}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          autoFocus
          aria-label={confirmText}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
