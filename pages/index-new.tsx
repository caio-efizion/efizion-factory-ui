import React from 'react';
import Head from 'next/head';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from '../src/theme';
import Header from '../src/components/layout/Header';
import Sidebar from '../src/components/layout/Sidebar';
import Main from '../src/components/layout/Main';
import TaskListEnhanced from '../src/components/TaskListEnhanced';

/**
 * Página principal - Lista de tarefas
 * - Layout responsivo com Header + Sidebar
 * - Tema acessível (WCAG AA)
 * - Sistema de notificações
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Efizion Factory - Automação de Tarefas</title>
        <meta
          name="description"
          content="Plataforma de automação de tarefas com integração GitHub"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={5000}
        >
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header />
            <Sidebar />
            <Main>
              <TaskListEnhanced />
            </Main>
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
