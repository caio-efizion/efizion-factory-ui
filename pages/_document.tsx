import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

/**
 * Custom Document para otimizações de performance e SEO
 * - Preload de fontes críticas
 * - Meta tags de performance
 * - Link preconnect para recursos externos
 */
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          {/* Preconnect para recursos externos */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Preload de fontes críticas (Roboto é usada pelo MUI) */}
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
            as="style"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          
          {/* Meta tags de performance */}
          <meta name="theme-color" content="#1565C0" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          
          {/* Manifest para PWA (futuro) */}
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
