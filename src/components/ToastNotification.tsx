import React from 'react';
import { useSnackbar } from 'notistack';

export default function ToastNotification({ message, variant = 'info' }: { message: string; variant?: 'success' | 'error' | 'info' | 'warning' }) {
  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    if (message) enqueueSnackbar(message, { variant });
  }, [message, variant, enqueueSnackbar]);
  return null;
}
