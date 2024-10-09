import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  return (
    <div>
      <h1>Welcome to our E-commerce Store</h1>
      {session ? (
        <p>Welcome, {session.user.email}</p>
      ) : (
        <p>Please sign in to access all features</p>
      )}
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.title} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}