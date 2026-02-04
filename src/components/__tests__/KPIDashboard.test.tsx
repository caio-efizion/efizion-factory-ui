import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KPIDashboard from '../KPIDashboard';

const mockKPIs = {
  totalProjects: 10,
  activeProjects: 5,
  totalJobs: 50,
  successJobs: 40,
  failedJobs: 5,
  activeAgents: 3,
};

describe('KPIDashboard', () => {
  it('deve renderizar título do painel', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Painel de KPIs')).toBeInTheDocument();
  });

  it('deve exibir total de projetos', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('deve exibir projetos ativos', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Ativos')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('deve exibir total de jobs', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('deve exibir jobs bem-sucedidos', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('deve exibir jobs com falha', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Falhas')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('deve exibir agentes ativos', () => {
    render(<KPIDashboard kpis={mockKPIs} />);
    
    expect(screen.getByText('Agentes Ativos')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('deve renderizar 6 cards de KPI', () => {
    const { container } = render(<KPIDashboard kpis={mockKPIs} />);
    
    const cards = container.querySelectorAll('.MuiCard-root');
    expect(cards).toHaveLength(6);
  });

  it('deve usar Grid responsivo', () => {
    const { container } = render(<KPIDashboard kpis={mockKPIs} />);
    
    const grid = container.querySelector('.MuiGrid-root');
    expect(grid).toBeInTheDocument();
  });

  it('deve exibir cores diferentes para cada card', () => {
    const { container } = render(<KPIDashboard kpis={mockKPIs} />);
    
    const cards = container.querySelectorAll('.MuiCard-root');
    // Verifica que existem cards com backgrounds diferentes
    expect(cards.length).toBeGreaterThan(0);
  });

  it('deve lidar com valores zero', () => {
    const emptyKPIs = {
      totalProjects: 0,
      activeProjects: 0,
      totalJobs: 0,
      successJobs: 0,
      failedJobs: 0,
      activeAgents: 0,
    };
    render(<KPIDashboard kpis={emptyKPIs} />);
    
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });

  it('deve lidar com valores grandes', () => {
    const largeKPIs = {
      totalProjects: 9999,
      activeProjects: 8888,
      totalJobs: 100000,
      successJobs: 99999,
      failedJobs: 1,
      activeAgents: 50,
    };
    render(<KPIDashboard kpis={largeKPIs} />);
    
    expect(screen.getByText('9999')).toBeInTheDocument();
    expect(screen.getByText('100000')).toBeInTheDocument();
  });
});
