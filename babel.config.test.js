// Este arquivo é usado APENAS para testes Jest
// O Next.js 16 usa SWC/Turbopack e não precisa de Babel para produção
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }], // Adiciona suporte automático ao React
  ],
};
