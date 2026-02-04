import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('deve renderizar com mensagem padrão', () => {
    render(<LoadingState />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem customizada', () => {
    render(<LoadingState message="Carregando tarefas..." />);
    
    expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument();
  });

  it('deve renderizar inline por padrão', () => {
    const { container } = render(<LoadingState />);
    
    // Não deve ter Backdrop quando não é fullScreen
    expect(container.querySelector('.MuiBackdrop-root')).not.toBeInTheDocument();
  });

  it('deve renderizar fullscreen com backdrop', () => {
    render(<LoadingState fullScreen message="Processando..." />);
    
    // Backdrop deve estar presente
    const backdrop = screen.getByRole('presentation');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass('MuiBackdrop-root');
  });

  it('deve ter atributos de acessibilidade corretos', () => {
    render(<LoadingState message="Aguarde..." />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
    expect(statusElement).toHaveAttribute('aria-busy', 'true');
  });

  it('deve renderizar CircularProgress com tamanho customizado', () => {
    const { container } = render(<LoadingState size={60} />);
    
    const progress = container.querySelector('.MuiCircularProgress-root');
    expect(progress).toBeInTheDocument();
  });

  it('deve ter aria-label no CircularProgress', () => {
    render(<LoadingState />);
    
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
  });
});
