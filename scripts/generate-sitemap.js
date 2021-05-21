const fs = require('fs');

const globby = require('globby');
const prettier = require('prettier');

const getDate = new Date().toISOString();

const YOUR_AWESOME_DOMAIN = "https://nextonestopshop.com";

(async () => {
    // Ignore Next.js specific files (e.g., _app.js) and API routes.
    const pages = await globby([
        'pages/**/*.js',
        '!pages/_*.js',
        '!pages/admin',
        '!pages/login',
        '!pages/product'
    ]);
    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                const path = page
                  .replace('pages', '')
                  .replace('.js', '')
                const route = path === '/index' ? '' : path;

                return `
                        <url>
                            <loc>${YOUR_AWESOME_DOMAIN}${route}</loc>
                            <lastmod>${getDate}</lastmod>
                        </url>
                    `;
              })
              .join('')}
        </urlset>
    `;

    // If you're not using Prettier, you can remove this.
    const formatted = prettier.format(sitemap, {
        parser: 'html'
    });

    fs.writeFileSync('public/sitemap-base.xml', formatted, "utf8");
})();