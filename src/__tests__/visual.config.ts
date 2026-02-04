/**
 * Configuração para testes visuais e screenshots automatizadas
 * Utiliza puppeteer + jest-image-snapshot
 */

import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

// Configuração de viewport padrões para teste responsivo
export const VIEWPORTS = {
  mobile: { width: 375, height: 667, deviceScaleFactor: 2 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
  desktop: { width: 1920, height: 1080, deviceScaleFactor: 1 },
};

// Configurações do jest-image-snapshot
export const imageSnapshotConfig = {
  failureThreshold: 0.01, // 1% de diferença aceitável
  failureThresholdType: 'percent' as const,
  customSnapshotsDir: '__image_snapshots__',
  customDiffDir: '__image_snapshots__/__diff_output__',
};
