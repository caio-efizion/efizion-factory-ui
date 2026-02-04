import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

const mockProject = {
  id: '1',
  name: 'Test Project',
  repo: 'https://github.com/test/repo',
  status: 'active',
};

describe('ProjectCard', () => {
  const mockHandlers = {
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onApprove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar informações do projeto', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText(/Repositório:/)).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('deve renderizar link do repositório', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    const link = screen.getByRole('link', { name: mockProject.repo });
    expect(link).toHaveAttribute('href', mockProject.repo);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('deve chamar onView quando botão Visualizar é clicado', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    const viewButton = screen.getByRole('button', { name: /visualizar/i });
    fireEvent.click(viewButton);
    
    expect(mockHandlers.onView).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onEdit quando botão Editar é clicado', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onDelete quando botão Deletar é clicado', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    const deleteButton = screen.getByRole('button', { name: /deletar/i });
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onApprove quando botão Aprovar é clicado', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    const approveButton = screen.getByRole('button', { name: /aprovar/i });
    fireEvent.click(approveButton);
    
    expect(mockHandlers.onApprove).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar 4 botões de ação', () => {
    render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    expect(screen.getByRole('button', { name: /visualizar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deletar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /aprovar/i })).toBeInTheDocument();
  });

  it('deve ter cores corretas nos botões', () => {
    const { container } = render(<ProjectCard {...mockProject} {...mockHandlers} />);
    
    const visualizarBtn = screen.getByRole('button', { name: /visualizar/i });
    const aprovarBtn = screen.getByRole('button', { name: /aprovar/i });
    
    // Botões contained devem ter a classe MuiButton-contained
    expect(visualizarBtn).toHaveClass('MuiButton-contained');
    expect(aprovarBtn).toHaveClass('MuiButton-contained');
  });

  it('deve usar status diferentes', () => {
    const { rerender } = render(<ProjectCard {...mockProject} status="pending" {...mockHandlers} />);
    expect(screen.getByText('pending')).toBeInTheDocument();
    
    rerender(<ProjectCard {...mockProject} status="completed" {...mockHandlers} />);
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('deve lidar com id numérico', () => {
    render(<ProjectCard {...mockProject} id={123} {...mockHandlers} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
});
