import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';
import { getProductFromCache, cacheProduct } from '../../utils/indexedDB';
import SEO from '../../components/SEO';

export default function ProductDetails({ product: initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  // ... rest of the component logic ...

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SEO 
        title={product.title}
        description={`${product.title} - ${product.description.substring(0, 160)}...`}
        canonical={`https://your-domain.com/product/${product.id}`}
      />
      <h1>{product.title}</h1>
      {/* ... rest of the component ... */}
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch a list of product IDs from your API or database
  const res = await fetch('https://your-api.com/products');
  const products = await res.json();

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  // Fetch the product data
  const res = await fetch(`https://your-api.com/product/${params.id}`);
  const product = await res.json();

  return {
    props: {
      product,
    },
    revalidate: 60, // Regenerate page every 60 seconds
  };
}