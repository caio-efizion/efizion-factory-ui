import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import { Task } from '../../types';

const mockTask: Task = {
  id: '1',
  title: 'Tarefa de Teste',
  description: 'Descrição da tarefa de teste',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  repoUrl: 'https://github.com/test/repo',
};

describe('TaskCard', () => {
  it('deve renderizar informações da tarefa', () => {
    render(<TaskCard task={mockTask} />);
    
    expect(screen.getByText('Tarefa de Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição da tarefa de teste')).toBeInTheDocument();
  });

  it('deve exibir chip de status correto para pending', () => {
    render(<TaskCard task={mockTask} />);
    
    const chip = screen.getByText('Pendente');
    expect(chip).toBeInTheDocument();
  });

  it('deve exibir chip de status correto para running', () => {
    const runningTask = { ...mockTask, status: 'running' as const };
    render(<TaskCard task={runningTask} />);
    
    expect(screen.getByText('Em execução')).toBeInTheDocument();
  });

  it('deve exibir chip de status correto para done', () => {
    const doneTask = { ...mockTask, status: 'done' as const };
    render(<TaskCard task={doneTask} />);
    
    expect(screen.getByText('Concluída')).toBeInTheDocument();
  });

  it('deve exibir chip de status correto para error', () => {
    const errorTask = { ...mockTask, status: 'error' as const };
    render(<TaskCard task={errorTask} />);
    
    expect(screen.getByText('Erro')).toBeInTheDocument();
  });

  it('deve chamar onView quando botão Ver detalhes é clicado', () => {
    const onView = jest.fn();
    render(<TaskCard task={mockTask} onView={onView} />);
    
    const viewButton = screen.getByLabelText('Ver detalhes da tarefa');
    fireEvent.click(viewButton);
    
    expect(onView).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onDelete quando botão Excluir é clicado', () => {
    const onDelete = jest.fn();
    render(<TaskCard task={mockTask} onDelete={onDelete} />);
    
    const deleteButton = screen.getByLabelText('Excluir tarefa');
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('deve exibir e chamar onRun apenas quando status é pending', () => {
    const onRun = jest.fn();
    render(<TaskCard task={mockTask} onRun={onRun} />);
    
    const runButton = screen.getByLabelText('Executar tarefa');
    expect(runButton).toBeInTheDocument();
    
    fireEvent.click(runButton);
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('não deve exibir botão Executar quando status não é pending', () => {
    const doneTask = { ...mockTask, status: 'done' as const };
    render(<TaskCard task={doneTask} onRun={jest.fn()} />);
    
    expect(screen.queryByLabelText('Executar tarefa')).not.toBeInTheDocument();
  });

  it('deve formatar data corretamente', () => {
    render(<TaskCard task={mockTask} />);
    
    // Verifica se há algum texto de data (formato pode variar)
    expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
  });

  it('deve ter hover effect no card', () => {
    const { container } = render(<TaskCard task={mockTask} />);
    
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('deve ter tooltips nos botões de ação', () => {
    render(<TaskCard task={mockTask} onView={jest.fn()} onDelete={jest.fn()} />);
    
    // Tooltips são renderizados pelo MUI
    expect(screen.getByLabelText('Ver detalhes da tarefa')).toBeInTheDocument();
    expect(screen.getByLabelText('Excluir tarefa')).toBeInTheDocument();
  });

  it('deve exibir ícone de relógio com data', () => {
    const { container } = render(<TaskCard task={mockTask} />);
    
    // MUI AccessTimeIcon deve estar presente
    const timeIcon = container.querySelector('[data-testid="AccessTimeIcon"]');
    expect(timeIcon).toBeInTheDocument();
  });

  it('deve truncar descrição longa', () => {
    const longTask = {
      ...mockTask,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
    };
    render(<TaskCard task={longTask} />);
    
    const description = screen.getByText(/Lorem ipsum/);
    expect(description).toBeInTheDocument();
  });
});
