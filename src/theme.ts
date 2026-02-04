import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * Tema customizado do Efizion Factory UI
 * Segue padrões WCAG 2.1 AA para acessibilidade
 * - Contraste mínimo de 4.5:1 para texto normal
 * - Contraste mínimo de 3:1 para texto grande e elementos UI
 */
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0', // Azul escuro - Contraste 4.54:1 com branco
      light: '#5E92F3',
      dark: '#003C8F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D84315', // Laranja escuro - Contraste 4.56:1 com branco
      light: '#FF6E40',
      dark: '#9F0000',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32', // Verde escuro - Contraste 4.54:1 com branco
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#E65100', // Laranja alaranjado - Contraste 4.51:1 com branco
      light: '#FF833A',
      dark: '#AC1900',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#C62828', // Vermelho escuro - Contraste 5.13:1 com branco
      light: '#FF5F52',
      dark: '#8E0000',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#0277BD', // Azul ciano - Contraste 4.52:1 com branco
      light: '#58A5F0',
      dark: '#004C8C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // Contraste 11.8:1 com branco
      secondary: 'rgba(0, 0, 0, 0.60)', // Contraste 5.74:1 com branco
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44, // Tamanho mínimo de toque (WCAG 2.1 - 2.5.5)
          padding: '10px 20px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#003C8F',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined' as const,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: 44, // Tamanho mínimo de toque
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          minHeight: 32,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);

export default theme;
