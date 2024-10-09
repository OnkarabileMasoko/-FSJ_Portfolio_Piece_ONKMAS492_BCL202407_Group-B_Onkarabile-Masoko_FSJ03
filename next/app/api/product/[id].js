import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';
import { getProductFromCache, cacheProduct } from '../../utils/indexedDB';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [id]);

  async function fetchProduct(productId) {
    try {
      const cachedProduct = await getProductFromCache(productId);
      if (cachedProduct) {
        setProduct(cachedProduct);
      }

      if (!isOffline) {
        const res = await fetch(`/api/product/${productId}`);
        const data = await res.json();
        setProduct(data);
        await cacheProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>
      
      {isOffline && <p>You are currently offline. Some features may be limited.</p>}
      
      <h2>Reviews</h2>
      <ReviewList productId={id} />
      
      {session ? (
        <ReviewForm productId={id} onReviewAdded={() => fetchProduct(id)} />
      ) : (
        <p>Please sign in to leave a review.</p>
      )}
    </div>
  );
}