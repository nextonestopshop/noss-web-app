const fs = require("fs");
const fetch = require("node-fetch");
const prettier = require("prettier");
var admin = require('firebase-admin');

var serviceAccount = require('../nosswebapp-firebase-adminsdk-sh0mp-ae1a18b926.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
});

const getDate = new Date().toISOString();

const YOUR_AWESOME_DOMAIN = "https://nextonestopshop.com/product";

const formatted = sitemap => prettier.format(sitemap, {
    parser: "html"
});

(async () => {
  
  const fetchProducts = []
    await admin.firestore().collection('products')
      .get().then(snapshot => {
        snapshot.forEach(doc => {
          let data = doc.data()
          fetchProducts.push(data.path)
        })
      }).catch(err => console.log(err))

    const postListSitemap = `
    ${fetchProducts
      .map(path => {
        return `
          <url>
            <loc>${`${YOUR_AWESOME_DOMAIN}/${path}`}</loc>
            <lastmod>${getDate}</lastmod>
          </url>`;
      })
      .join("")}
  `;

    const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" >
      ${postListSitemap}
    </urlset>
  `;

    const formattedSitemap = [formatted(generatedSitemap)];

    fs.writeFileSync("public/sitemap-products.xml", formattedSitemap, "utf8");
})();