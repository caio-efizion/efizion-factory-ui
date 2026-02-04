
# Efizion Factory UI

## Redesign Visual 2026

Interface totalmente modernizada com [Material UI](https://mui.com/):
- Layout profissional com Header, Sidebar, Cards, Badges, Feedback visual.
- Responsividade garantida (mobile, tablet, desktop).
- Componentes reutilizáveis em `src/components`.
- Pronto para integração dinâmica com API Efizion.

## Instalação

```bash
git clone https://github.com/caio-efizion/efizion-factory-ui.git
cd efizion-factory-ui
npm install
npm run dev
```

## Principais Dependências
- @mui/material
- @mui/icons-material
- @emotion/react
- @emotion/styled

## Estrutura de Componentes
- `src/components/layout/Header.tsx` — Cabeçalho fixo
- `src/components/layout/Sidebar.tsx` — Navegação lateral
- `src/components/layout/Main.tsx` — Área principal
- `src/components/TaskCard.tsx` — Card visual de tarefa
- `src/components/StatusBadge.tsx` — Badge de status
- `src/components/LoadingOverlay.tsx` — Feedback de carregamento

- `pages/dashboard.tsx` — Dashboard visual com cards, gráficos, filtros e integração API
- `src/components/AgentModal.tsx` — Modal detalhado de agente
- `src/components/JobModal.tsx` — Modal detalhado de job/tarefa
- `src/components/LogViewer.tsx` — Visualizador de logs em tempo real com filtro
- `src/components/ToastNotification.tsx` — Notificações toast/banner para eventos

## Recursos Avançados
- Cards de status (tarefas, jobs, agentes)
- Gráficos interativos (linha, pizza, barra) com [Recharts](https://recharts.org/)
- Modais detalhados para agentes e jobs
- Área de logs em tempo real, com busca e filtragem
- Notificações dinâmicas com [Notistack](https://notistack.com/)
- Filtros por período, status, responsável
- Integração real com API Efizion Agent Runner (substitua mocks por chamadas reais)


## Onboarding Avançado

### Fluxo Operacional Completo
1. Autentique-se com sua API Key.
2. Inicie novos projetos pelo botão "Novo Projeto" (modal interativo, integração real).
3. Revise projetos existentes em cards detalhados, com ações avançadas (aprovar, editar, deletar, visualizar histórico/logs).
4. Visualize KPIs, gráficos e status global no dashboard principal.
5. Crie e execute tarefas, monitore logs em tempo real e receba notificações instantâneas.
6. Navegue por onboarding guiado (tour passo-a-passo) para squads e novos usuários.
7. Acesse histórico/auditoria de todas ações e execuções, com filtros e exportação.
8. Experimente responsividade, acessibilidade e feedback visual em cada etapa.

### Exemplos de Integração
```tsx
// Criar novo projeto
<ProjectModal open={showProjectModal} onClose={...} onSubmit={data => ...} />

// Listar projetos
<ProjectList projects={projects} onView={...} onEdit={...} onDelete={...} onApprove={...} />

// Dashboard de KPIs
<KPIDashboard kpis={{ ... }} />

// Onboarding guiado
<OnboardingTour step={onboardingStep} onNext={...} onClose={...} />
```

### Prints e Vídeos
- Inclua prints do dashboard, cards de projetos/tarefas, KPIs, onboarding, logs e notificações.
- Vídeos curtos demonstrando onboarding, criação/revisão de projetos, execução de tarefas e monitoramento.

### Templates para Squads
- Exemplos de uso para dev, gestor, QA, PO.
- Fluxos de integração, troubleshooting e boas práticas.

### Dicas de Boas Práticas
- Use onboarding guiado para treinar equipes.
- Aproveite KPIs e gráficos para monitorar performance e status global.
- Utilize histórico/auditoria para rastreabilidade e compliance.

### Roadmap de Evolução
- Integração com CI/CD externos.
- KPIs, relatórios, exportação de dados.
- Expansão de gráficos e painéis customizados.
- Sugestões contínuas baseadas em feedback real de equipes.

## Onboarding e Usabilidade
- Navegação fluida por Sidebar
- Layout responsivo e acessível
- Feedback visual em todas ações

## Prints e Vídeos
Inclua prints do dashboard, cards de tarefas, formulário de cadastro, detalhe e execução para onboarding de novos usuários/devs.

## Compatibilidade Next.js 13+ e Material UI

Sidebar utiliza o padrão oficial Next.js 13+ para navegação:
- O componente `Link` envolve o `Button` do Material UI dentro do `ListItem`, eliminando warnings e garantindo acessibilidade e responsividade.
- Não utiliza mais `legacyBehavior` ou atributos obsoletos.

Exemplo:
```tsx
<ListItem key={item.text} disablePadding>
	<Link href={item.href} passHref>
		<Button startIcon={item.icon} fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
			{item.text}
		</Button>
	</Link>
</ListItem>
```

Consulte `src/components/layout/Sidebar.tsx` para referência.

## Exemplo de Uso

Veja `pages/index.tsx` para exemplo de layout moderno, mock de tarefas e integração dos componentes visuais.

## Customização de Tema
Edite o objeto `theme` em `pages/index.tsx` para alterar cores, tipografia e espaçamentos.

## Acessibilidade
- Cores e contraste revisados
- Labels e navegação por teclado

## Roadmap
- Integração dinâmica com API Efizion
- Expansão de componentes visuais
- Onboarding guiado para equipes

## Dúvidas e Troubleshooting
- Certifique-se de instalar todas dependências
- Para problemas de build, cheque lockfiles duplicados

---
Interface pronta para evolução contínua e padrões SaaS de mercado.