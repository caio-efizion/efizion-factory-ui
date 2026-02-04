import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  LinearProgress,
  Fade,
  Tooltip,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Tour interativo de onboarding com:
 * - Progresso visual e persistência
 * - Navegação entre etapas
 * - Feedback de conclusão
 * - Menu de ajuda
 */

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // Seletor CSS do elemento a destacar
  action?: string; // Ação sugerida
}

interface OnboardingTourProps {
  /** Se true, inicia tour automaticamente */
  autoStart?: boolean;
  /** Callback quando tour é concluído */
  onComplete?: () => void;
  /** Callback quando tour é fechado */
  onClose?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: '🎉 Bem-vindo à Efizion Factory!',
    description: 'Aqui você pode criar, revisar e gerenciar projetos de automação de forma profissional. Vamos fazer um tour rápido pela interface!',
    action: 'Clique em "Próximo" para começar',
  },
  {
    id: 'tasks',
    title: '📋 Gerenciar Tarefas',
    description: 'Na área de tarefas você pode visualizar, criar e executar automações. Use os filtros para encontrar tarefas específicas e o botão "+" para criar novas.',
    target: '[aria-label*="Criar"]',
    action: 'Experimente criar sua primeira tarefa',
  },
  {
    id: 'dashboard',
    title: '📊 Dashboard e KPIs',
    description: 'O dashboard mostra métricas importantes: projetos ativos, jobs executados, taxa de sucesso e agentes online. Use-o para monitorar a saúde do sistema.',
    target: '.recharts-wrapper',
    action: 'Visualize os gráficos interativos',
  },
  {
    id: 'status',
    title: '🎯 Status das Tarefas',
    description: 'Cada tarefa tem um status visual: Pendente (azul), Em execução (laranja), Concluída (verde) ou Erro (vermelho). Clique nas tarefas para ver detalhes e logs.',
    action: 'Clique em uma tarefa para explorar',
  },
  {
    id: 'actions',
    title: '⚡ Ações Rápidas',
    description: 'Use os botões de ação para executar, visualizar ou excluir tarefas. Todas as ações críticas pedem confirmação para evitar erros.',
    target: '[aria-label*="Excluir"]',
    action: 'Ações seguras com confirmação',
  },
  {
    id: 'help',
    title: '💡 Precisa de Ajuda?',
    description: 'Clique no ícone de ajuda (?) no canto superior direito a qualquer momento para reabrir este tour. Você também pode reiniciar o tour através das configurações.',
    action: 'Tour concluído! Explore à vontade',
  },
];

const STORAGE_KEY = 'efizion-onboarding-progress';

export default function OnboardingTour({ 
  autoStart = false, 
  onComplete,
  onClose 
}: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Carrega progresso do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { completed, lastStep, tourCompleted } = JSON.parse(saved);
        setCompletedSteps(completed || []);
        
        // Não inicia automaticamente se já completou
        if (!tourCompleted && autoStart) {
          setIsOpen(true);
          setCurrentStep(lastStep || 0);
        }
      } catch (e) {
        // localStorage corrompido, ignora
      }
    } else if (autoStart) {
      setIsOpen(true);
    }
  }, [autoStart]);

  // Salva progresso no localStorage
  useEffect(() => {
    if (isOpen) {
      const progress = {
        completed: completedSteps,
        lastStep: currentStep,
        tourCompleted: currentStep === TOUR_STEPS.length - 1 && completedSteps.length === TOUR_STEPS.length,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [currentStep, completedSteps, isOpen]);

  const handleNext = () => {
    const currentStepId = TOUR_STEPS[currentStep].id;
    
    // Marca etapa como concluída
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps([...completedSteps, currentStepId]);
    }

    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const progress = {
      completed: TOUR_STEPS.map(s => s.id),
      lastStep: TOUR_STEPS.length - 1,
      tourCompleted: true,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    
    setIsOpen(false);
    onComplete?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    localStorage.removeItem(STORAGE_KEY);
    setIsOpen(true);
  };

  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;
  const step = TOUR_STEPS[currentStep];

  if (!isOpen) {
    // Botão flutuante de ajuda
    return (
      <Tooltip title="Reabrir tour de onboarding" placement="left">
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: 4,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            zIndex: 1000,
          }}
          aria-label="Abrir tour de onboarding"
        >
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Fade in={isOpen}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: { xs: 'calc(100% - 48px)', sm: 420 },
          maxWidth: 500,
          zIndex: 1300,
          bgcolor: 'background.paper',
        }}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            pb: 1,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" id="tour-title">
              Onboarding Efizion
            </Typography>
            <Chip
              label={`${currentStep + 1}/${TOUR_STEPS.length}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
          <Box>
            <Tooltip title="Reiniciar tour">
              <IconButton
                size="small"
                onClick={handleRestart}
                sx={{ color: 'white', mr: 0.5 }}
                aria-label="Reiniciar tour"
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fechar">
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ color: 'white' }}
                aria-label="Fechar tour"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6 }}
          aria-label={`Progresso do tour: ${Math.round(progress)}%`}
        />

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {step.title}
          </Typography>
          
          <Typography
            id="tour-description"
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {step.description}
          </Typography>

          {step.action && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                {step.action}
              </Typography>
            </Box>
          )}

          {/* Completed Steps Counter */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            ✓ {completedSteps.length} de {TOUR_STEPS.length} etapas concluídas
          </Typography>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            p: 2,
            pt: 0,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Button
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outlined"
            size="small"
          >
            Anterior
          </Button>

          <Button
            endIcon={currentStep < TOUR_STEPS.length - 1 ? <NavigateNextIcon /> : <CheckCircleIcon />}
            onClick={handleNext}
            variant="contained"
            size="small"
            color={currentStep === TOUR_STEPS.length - 1 ? 'success' : 'primary'}
          >
            {currentStep < TOUR_STEPS.length - 1 ? 'Próximo' : 'Concluir'}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
}
