import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to our E-commerce Store</h1>
      {session ? (
        <>
          <p>Welcome, {session.user.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <Link href="/auth/signin">Sign In</Link>
          <Link href="/auth/signup">Sign Up</Link>
        </>
      )}
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link href={`/product/${product.id}`}>
              {product.title} - ${product.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}