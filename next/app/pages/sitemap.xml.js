import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps = async (ctx) => {
  // Fetch your list of products
  const res = await fetch('https://your-api.com/products');
  const products = await res.json();

  const fields = [
    {
      loc: 'https://your-domain.com', // Homepage
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1,
    },
    ...products.map((product) => ({
      loc: `https://your-domain.com/product/${product.id}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    })),
  ];

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}