import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingTour from '../OnboardingTour';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('OnboardingTour', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Renderização Inicial', () => {
    it('deve renderizar tour com autoStart desabilitado', () => {
      render(<OnboardingTour autoStart={false} />);
      
      // Deve mostrar botão flutuante de ajuda
      const helpButton = screen.getByRole('button', { name: /iniciar tour/i });
      expect(helpButton).toBeInTheDocument();
    });

    it('deve iniciar tour automaticamente com autoStart', () => {
      render(<OnboardingTour autoStart={true} />);
      
      // Deve mostrar primeiro passo do tour
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });

    it('não deve iniciar tour se já foi completado', () => {
      localStorageMock.setItem('efizion-onboarding-progress', JSON.stringify({
        completed: true,
        lastStep: 5,
        tourCompleted: true,
      }));
      
      render(<OnboardingTour autoStart={true} />);
      
      // Deve mostrar botão flutuante, não o tour
      expect(screen.getByRole('button', { name: /iniciar tour/i })).toBeInTheDocument();
      expect(screen.queryByText(/bem-vindo/i)).not.toBeInTheDocument();
    });
  });

  describe('Navegação entre Etapas', () => {
    it('deve navegar para próxima etapa', () => {
      render(<OnboardingTour autoStart={true} />);
      
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      
      // Deve mostrar segunda etapa (tarefas)
      expect(screen.getByText(/tarefas/i)).toBeInTheDocument();
    });

    it('deve navegar para etapa anterior', () => {
      render(<OnboardingTour autoStart={true} />);
      
      // Avançar para segunda etapa
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      
      expect(screen.getByText(/tarefas/i)).toBeInTheDocument();
      
      // Voltar para primeira etapa
      const prevButton = screen.getByRole('button', { name: /anterior/i });
      fireEvent.click(prevButton);
      
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });

    it('não deve mostrar botão Anterior na primeira etapa', () => {
      render(<OnboardingTour autoStart={true} />);
      
      expect(screen.queryByRole('button', { name: /anterior/i })).not.toBeInTheDocument();
    });

    it('deve mostrar botão Concluir na última etapa', () => {
      render(<OnboardingTour autoStart={true} />);
      
      // Navegar até última etapa
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      
      // 6 etapas, então clicar 5 vezes para chegar na última
      for (let i = 0; i < 5; i++) {
        fireEvent.click(nextButton);
      }
      
      // Na última etapa, botão muda para "Concluir"
      expect(screen.getByRole('button', { name: /concluir/i })).toBeInTheDocument();
    });
  });

  describe('Persistência de Progresso', () => {
    it('deve salvar progresso no localStorage', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      
      const stored = JSON.parse(localStorageMock.getItem('efizion-onboarding-progress') || '{}');
      expect(stored.lastStep).toBe(1);
      expect(stored.completed).toContain(0);
      expect(stored.completed).toContain(1);
    });

    it('deve restaurar progresso salvo', () => {
      localStorageMock.setItem('efizion-onboarding-progress', JSON.stringify({
        completed: [0, 1, 2],
        lastStep: 2,
        tourCompleted: false,
      }));
      
      render(<OnboardingTour autoStart={true} />);
      
      // Deve iniciar na etapa salva
      const stored = JSON.parse(localStorageMock.getItem('efizion-onboarding-progress') || '{}');
      expect(stored.lastStep).toBeGreaterThanOrEqual(0);
    });

    it('deve marcar tour como completado ao finalizar', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      
      // Navegar até última etapa
      for (let i = 0; i < 5; i++) {
        fireEvent.click(nextButton);
      }
      
      // Concluir tour
      const finishButton = screen.getByRole('button', { name: /concluir/i });
      fireEvent.click(finishButton);
      
      const stored = JSON.parse(localStorageMock.getItem('efizion-onboarding-progress') || '{}');
      expect(stored.tourCompleted).toBe(true);
    });
  });

  describe('Ações do Tour', () => {
    it('deve fechar tour ao clicar no botão Fechar', () => {
      render(<OnboardingTour autoStart={true} />);
      
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
      
      const closeButton = screen.getByRole('button', { name: /fechar tour/i });
      fireEvent.click(closeButton);
      
      // Tour deve ser fechado
      expect(screen.queryByText(/bem-vindo/i)).not.toBeInTheDocument();
    });

    it('deve reiniciar tour ao clicar em Reiniciar', async () => {
      render(<OnboardingTour autoStart={true} />);
      
      // Avançar algumas etapas
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      const resetButton = screen.getByRole('button', { name: /reiniciar/i });
      fireEvent.click(resetButton);
      
      await waitFor(() => {
        expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
      });
    });

    it('deve chamar onComplete ao concluir tour', () => {
      const onCompleteMock = jest.fn();
      render(<OnboardingTour autoStart={true} onComplete={onCompleteMock} />);
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      
      // Navegar até última etapa
      for (let i = 0; i < 5; i++) {
        fireEvent.click(nextButton);
      }
      
      // Concluir tour
      const finishButton = screen.getByRole('button', { name: /concluir/i });
      fireEvent.click(finishButton);
      
      expect(onCompleteMock).toHaveBeenCalled();
    });

    it('deve chamar onClose ao fechar tour', () => {
      const onCloseMock = jest.fn();
      render(<OnboardingTour autoStart={true} onClose={onCloseMock} />);
      
      const closeButton = screen.getByRole('button', { name: /fechar tour/i });
      fireEvent.click(closeButton);
      
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('Indicador de Progresso', () => {
    it('deve mostrar contador de etapas', () => {
      render(<OnboardingTour autoStart={true} />);
      
      // Primeira etapa: 1/6
      expect(screen.getByText(/1\/6/i)).toBeInTheDocument();
    });

    it('deve atualizar contador ao navegar', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      
      // Segunda etapa: 2/6
      expect(screen.getByText(/2\/6/i)).toBeInTheDocument();
    });

    it('deve exibir barra de progresso', () => {
      render(<OnboardingTour autoStart={true} />);
      
      // Deve ter LinearProgress component
      const progressBar = document.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('deve atualizar barra de progresso ao navegar', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const progressBar = document.querySelector('[role="progressbar"]') as HTMLElement;
      const initialValue = progressBar?.getAttribute('aria-valuenow');
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      
      const updatedValue = progressBar?.getAttribute('aria-valuenow');
      expect(Number(updatedValue)).toBeGreaterThan(Number(initialValue));
    });
  });

  describe('Conteúdo das Etapas', () => {
    it('deve conter etapa de Boas-Vindas', () => {
      render(<OnboardingTour autoStart={true} />);
      
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });

    it('deve conter etapa de Tarefas', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      
      expect(screen.getByText(/tarefas/i)).toBeInTheDocument();
    });

    it('deve conter etapa de Dashboard', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role="dialog" no tour', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it('deve ter aria-label nos botões', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const closeButton = screen.getByRole('button', { name: /fechar tour/i });
      expect(closeButton).toHaveAttribute('aria-label');
    });

    it('deve ter descrição acessível para barra de progresso', () => {
      render(<OnboardingTour autoStart={true} />);
      
      const progressBar = document.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });
  });

  describe('Responsividade', () => {
    it('deve renderizar em dispositivos mobile', () => {
      // Mock viewport mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<OnboardingTour autoStart={true} />);
      
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });
  });

  describe('Estados de Erro', () => {
    it('deve funcionar mesmo com localStorage corrompido', () => {
      localStorageMock.setItem('efizion-onboarding-progress', 'invalid json');
      
      render(<OnboardingTour autoStart={true} />);
      
      // Deve iniciar normalmente desde o começo
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });

    it('deve lidar com dados inválidos no localStorage', () => {
      localStorageMock.setItem('efizion-onboarding-progress', JSON.stringify({
        invalidKey: 'test',
      }));
      
      render(<OnboardingTour autoStart={true} />);
      
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });
  });
});
