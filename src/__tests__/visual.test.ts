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
});
