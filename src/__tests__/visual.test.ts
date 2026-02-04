/**
 * Testes visuais e screenshots automatizadas
 * Capturam telas em diferentes viewports e estados
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { VIEWPORTS, imageSnapshotConfig } from './visual.config';

describe('Visual Regression Tests', () => {
  let browser: Browser;
  let page: Page;
  const baseURL = process.env.TEST_URL || 'http://localhost:3000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Homepage Screenshots', () => {
    it('deve capturar homepage em desktop', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL, { waitUntil: 'networkidle0' });
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-desktop',
      });
    });

    it('deve capturar homepage em tablet', async () => {
      await page.setViewport(VIEWPORTS.tablet);
      await page.goto(baseURL, { waitUntil: 'networkidle0' });
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-tablet',
      });
    });

    it('deve capturar homepage em mobile', async () => {
      await page.setViewport(VIEWPORTS.mobile);
      await page.goto(baseURL, { waitUntil: 'networkidle0' });
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-mobile',
      });
    });
  });

  describe('TaskList Screenshots', () => {
    it('deve capturar lista vazia', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(`${baseURL}/tasks`, { waitUntil: 'networkidle0' });
      
      // Aguarda estado vazio carregar
      await page.waitForSelector('[role="status"]', { timeout: 5000 }).catch(() => {});
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'tasklist-empty',
      });
    });

    it('deve capturar loading state', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      
      // Intercepta requisições para simular loading
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.url().includes('/api/tasks')) {
          // Delay na resposta para capturar loading
          setTimeout(() => request.continue(), 2000);
        } else {
          request.continue();
        }
      });
      
      await page.goto(`${baseURL}/tasks`);
      
      // Captura durante loading
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'tasklist-loading',
      });
    });
  });

  describe('Dashboard Screenshots', () => {
    it('deve capturar dashboard com KPIs', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle0' });
      
      // Aguarda gráficos renderizarem
      await page.waitForSelector('.recharts-wrapper', { timeout: 5000 }).catch(() => {});
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'dashboard-desktop',
      });
    });

    it('deve capturar dashboard em mobile', async () => {
      await page.setViewport(VIEWPORTS.mobile);
      await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle0' });
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'dashboard-mobile',
      });
    });
  });

  describe('Accessibility Screenshots', () => {
    it('deve capturar página com alto contraste', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Emula preferência de alto contraste
      await page.emulateMediaFeatures([
        { name: 'prefers-contrast', value: 'high' },
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-high-contrast',
      });
    });

    it('deve capturar com modo escuro', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Emula dark mode
      await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-dark-mode',
      });
    });

    it('deve capturar com texto aumentado', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Aumenta tamanho da fonte
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '20px';
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-large-text',
      });
    });
  });

  describe('Component Screenshots', () => {
    it('deve capturar modal de confirmação', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(`${baseURL}/tasks`);
      
      // Tenta abrir modal de exclusão (se houver tarefas)
      const deleteButton = await page.$('[aria-label*="Excluir"]');
      if (deleteButton) {
        await deleteButton.click();
        await page.waitForSelector('[role="dialog"]', { timeout: 2000 });
        
        const screenshot = await page.screenshot();
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'confirm-dialog',
        });
      }
    });

    it('deve capturar formulário de criação', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(`${baseURL}/tasks/new`);
      
      await page.waitForSelector('form', { timeout: 5000 }).catch(() => {});
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'task-form',
      });
    });
  });

  describe('Error States Screenshots', () => {
    it('deve capturar estado de erro 404', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      
      const response = await page.goto(`${baseURL}/not-found-page`, { 
        waitUntil: 'networkidle0' 
      });
      
      if (response && response.status() === 404) {
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'error-404',
        });
      }
    });
  });

  describe('Fluxo de Criação de Tarefa', () => {
    it('deve capturar formulário vazio', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Procura botão "Nova Tarefa" ou similar
      await page.waitForSelector('button', { timeout: 5000 }).catch(() => {});
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'create-task-form-empty',
      });
    });

    it('deve capturar formulário preenchido', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Preenche formulário
      const titleInput = await page.$('input[name="title"]');
      const descInput = await page.$('textarea[name="description"]');
      
      if (titleInput && descInput) {
        await titleInput.type('Nova Tarefa de Teste');
        await descInput.type('Descrição da tarefa https://github.com/test/repo');
        
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'create-task-form-filled',
        });
      }
    });

    it('deve capturar validação de erro', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Tenta submeter formulário vazio
      const titleInput = await page.$('input[name="title"]');
      
      if (titleInput) {
        await titleInput.focus();
        await titleInput.type('Ab'); // Título muito curto
        await page.evaluate(() => {
          const input = document.querySelector('input[name="title"]') as HTMLInputElement;
          if (input) input.blur();
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'create-task-form-validation-error',
        });
      }
    });
  });

  describe('Fluxo de Monitoramento de Tarefas', () => {
    it('deve capturar lista com tarefas', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Aguarda tarefas carregarem
      await page.waitForSelector('[data-testid="task-card"]', { timeout: 5000 }).catch(() => {});
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'task-monitoring-list',
      });
    });

    it('deve capturar busca ativa', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      const searchInput = await page.$('input[type="search"], input[placeholder*="Buscar"]');
      
      if (searchInput) {
        await searchInput.type('deploy');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'task-monitoring-search-active',
        });
      }
    });

    it('deve capturar filtro por status', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Procura chips/botões de filtro
      const filterButton = await page.$('[data-testid*="filter"], button[aria-label*="filtro"]');
      
      if (filterButton) {
        await filterButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'task-monitoring-filter-active',
        });
      }
    });

    it('deve capturar detalhes de tarefa', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Clica em primeira tarefa (se existir)
      const taskCard = await page.$('[data-testid="task-card"]');
      
      if (taskCard) {
        await taskCard.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'task-details-view',
        });
      }
    });
  });

  describe('Fluxo de Cancelamento de Tarefa', () => {
    it('deve capturar modal de confirmação de exclusão', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Procura botão de exclusão
      await page.waitForSelector('[data-testid="task-card"]', { timeout: 5000 }).catch(() => {});
      
      const deleteButton = await page.$('[aria-label*="Excluir"], button[title*="Excluir"]');
      
      if (deleteButton) {
        await deleteButton.click();
        await page.waitForSelector('[role="dialog"]', { timeout: 2000 }).catch(() => {});
        
        const screenshot = await page.screenshot();
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: 'task-delete-confirmation-modal',
        });
      }
    });

    it('deve capturar notificação de sucesso', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Simula ação que gera notificação
      await page.evaluate(() => {
        // Dispara evento customizado para mostrar notificação
        const event = new CustomEvent('show-notification', {
          detail: { message: 'Tarefa excluída com sucesso!', variant: 'success' }
        });
        window.dispatchEvent(event);
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'notification-success',
      });
    });
  });

  describe('Dark Mode - Todas as Páginas', () => {
    beforeEach(async () => {
      await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
      ]);
    });

    it('deve capturar homepage em dark mode', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-dark-mode-full',
      });
    });

    it('deve capturar dashboard em dark mode', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'dashboard-dark-mode',
      });
    });

    it('deve capturar formulário em dark mode', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'form-dark-mode',
      });
    });
  });

  describe('Light Mode - Confirmação', () => {
    beforeEach(async () => {
      await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'light' },
      ]);
    });

    it('deve capturar homepage em light mode', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'homepage-light-mode',
      });
    });

    it('deve capturar KPI cards em light mode', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      await page.waitForSelector('[data-testid="kpi-card"]', { timeout: 5000 }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'kpi-cards-light-mode',
      });
    });
  });

  describe('Responsividade Completa', () => {
    const viewports = [
      { name: 'mobile-portrait', width: 375, height: 667, deviceScaleFactor: 2 },
      { name: 'mobile-landscape', width: 667, height: 375, deviceScaleFactor: 2 },
      { name: 'tablet-portrait', width: 768, height: 1024, deviceScaleFactor: 2 },
      { name: 'desktop-small', width: 1280, height: 720, deviceScaleFactor: 1 },
      { name: 'desktop-large', width: 1920, height: 1080, deviceScaleFactor: 1 },
    ];

    viewports.forEach(viewport => {
      it(`deve capturar homepage em ${viewport.name}`, async () => {
        await page.setViewport(viewport);
        await page.goto(baseURL, { waitUntil: 'networkidle0' });
        
        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchImageSnapshot({
          ...imageSnapshotConfig,
          customSnapshotIdentifier: `homepage-${viewport.name}`,
        });
      });
    });
  });

  describe('OnboardingTour Screenshots', () => {
    it('deve capturar tour na primeira etapa', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      // Aguarda tour aparecer (se autoStart)
      await page.waitForSelector('[role="dialog"]', { timeout: 3000 }).catch(() => {});
      
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'onboarding-tour-step-1',
      });
    });

    it('deve capturar barra de progresso do tour', async () => {
      await page.setViewport(VIEWPORTS.desktop);
      await page.goto(baseURL);
      
      await page.waitForSelector('[role="progressbar"]', { timeout: 3000 }).catch(() => {});
      
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        ...imageSnapshotConfig,
        customSnapshotIdentifier: 'onboarding-tour-progress',
      });
    });
  });
});
