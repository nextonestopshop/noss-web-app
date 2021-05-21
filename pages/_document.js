import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-197202772-1"></script>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', 'UA-197202772-1');
                        `
                    }} />
                    <meta charSet="utf-8" />
                    <meta name="robots" content="index, follow" />
                    <link rel="icon" href="/NOSS_Favicon_2-32x32.jpeg" sizes="32x32" />
                    <link rel="icon" href="/NOSS_Favicon_2-192x192.jpeg" sizes="192x192" />
                    <link rel="preload" href="/images/noss-logo.png" as="image" />
                    <link rel="apple-touch-icon" href="/NOSS_Favicon_2-180x180.jpeg" />
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


MyDocument.getInitialProps = async (ctx) => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
    originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};