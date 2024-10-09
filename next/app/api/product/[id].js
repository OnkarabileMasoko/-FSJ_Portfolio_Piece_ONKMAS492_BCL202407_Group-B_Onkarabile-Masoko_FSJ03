import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  async function fetchProduct(productId) {
    const res = await fetch(`/api/product/${productId}`);
    const data = await res.json();
    setProduct(data);
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>
      
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