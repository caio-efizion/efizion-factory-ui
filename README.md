
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

### Fluxo Completo
1. Autentique-se com sua API Key.
2. Visualize tarefas e jobs em cards responsivos.
3. Crie novas tarefas com validação automática.
4. Execute tarefas e monitore logs em tempo real.
5. Receba notificações instantâneas de sucesso/erro.
6. Acesse histórico/auditoria de todas ações e execuções.
7. Navegue por todos dispositivos com acessibilidade garantida.

### Auditoria e Histórico
- Todas ações (criação, execução, status) são registradas e exibidas em área dedicada.
- Filtros por status, data, agente e usuário.
- Logs detalhados e exportáveis por tarefa/job/agente.

### Performance e Caching
- Listagem de tarefas/jobs otimizada com caching inteligente.
- Redução de latência e requisições repetitivas.
- Monitoramento do tempo de resposta da API, com alertas visuais.

### Acessibilidade
- Aria-labels, navegação por teclado, contraste AA/AAA, feedback visual ativo.
- Testes automatizados e manuais em mobile, tablet, desktop e navegadores.

### Exemplos de Integração
```tsx
// Listar tarefas
const tasks = useApi('/api/tasks', { method: 'GET' });

// Criar tarefa
await createTask({ title, description });

// Detalhe da tarefa
const detail = await fetchTaskDetail(id);

// Executar tarefa
await axios.post(`/api/tasks/${id}/run`, {}, { headers: { 'x-api-key': apiKey } });

// Visualizar logs em tempo real
const logs = await fetchTaskLogs(id);
```

### Prints e Vídeos
- Inclua prints do dashboard, cards, formulários, logs, auditoria e notificações.
- Vídeos curtos demonstrando onboarding, execução e monitoramento.

### Documentação dos Hooks Customizados
- `useAuth`: Gerencia autenticação e persistência da API Key.
- `useApi`: Realiza requisições HTTP, injeta automaticamente o header `x-api-key`.

### Templates para Squads
- Exemplos de uso para dev, gestor, QA, PO.
- Fluxos de integração e troubleshooting.

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