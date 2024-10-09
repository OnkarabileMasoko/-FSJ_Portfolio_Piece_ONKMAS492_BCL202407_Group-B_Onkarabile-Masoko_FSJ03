import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import SEO from '../components/SEO';

export default function Home({ products }) {
  const { data: session } = useSession();

  return (
    <div>
      <SEO 
        title="Welcome to NextShop"
        description="Discover amazing products at NextShop, your one-stop e-commerce destination."
        canonical="https://your-domain.com"
      />
      <h1>Welcome to NextShop</h1>
      {/* ... rest of the component ... */}
    </div>
  );
}

export async function getStaticProps() {
  // Fetch products from your API or database
  const res = await fetch('https://your-api.com/products');
  const products = await res.json();

  return {
    props: {
      products,
    },
    revalidate: 60, // Regenerate page every 60 seconds
  };
}