import React from 'react';
import { Button, Typography, Box } from '@mui/material';

interface OnboardingTourProps {
  step: number;
  onNext: () => void;
  onClose: () => void;
}

const steps = [
  'Bem-vindo à Fábrica de Software Efizion! Aqui você pode criar, revisar e gerenciar projetos de forma profissional.',
  'Use o botão "Novo Projeto" para iniciar um projeto e integrar com seu repositório GitHub.',
  'Visualize KPIs, status e insights operacionais no dashboard principal.',
  'Revise projetos, aprove, edite, delete e acompanhe logs e histórico de execuções.',
  'Receba notificações em tempo real sobre jobs, agentes e status do sistema.',
  'Explore todas funcionalidades e conte com onboarding guiado para equipes.'
];

export default function OnboardingTour({ step, onNext, onClose }: OnboardingTourProps) {
  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, bgcolor: '#fff', boxShadow: 4, borderRadius: 2, p: 3, zIndex: 9999, maxWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>Onboarding Efizion</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{steps[step]}</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {step < steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={onNext}>Próximo</Button>
        ) : (
          <Button variant="contained" color="success" onClick={onClose}>Finalizar</Button>
        )}
      </Box>
    </Box>
  );
}
