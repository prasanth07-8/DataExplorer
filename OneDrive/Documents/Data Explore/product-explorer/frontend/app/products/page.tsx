'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../lib/api';
import Link from 'next/link';
import ProductGridSkeleton from '../../components/ProductGridSkeleton';
import type { Metadata } from 'next';

/**
 * ✅ SEO METADATA (SERVER SIDE)
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ categorySlug?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = params.categorySlug ?? 'Products';

  return {
    title: `${category} Products | DataExplorer`,
    description: `Browse ${category} products scraped from the web`,
  };
}

/**
 * ✅ CLIENT COMPONENT
 */
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get('categorySlug');
  const page = Number(searchParams.get('page') ?? 1);
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', categorySlug, page],
    queryFn: () => fetchProducts(categorySlug!, page, limit),
    enabled: !!categorySlug,
    keepPreviousData: true,
  });

  // Skeleton loader
  if (isLoading) {
    return (
      <section className="p-4">
        <h1 className="text-xl font-bold mb-4">Products</h1>
        <ProductGridSkeleton />
      </section>
    );
  }

  if (error || !data) {
    return (
      <p className="p-4 text-red-500">
        Failed to load products
      </p>
    );
  }

  // Remove junk products
  const products = data.items.filter(
    (p: any) => typeof p.price === 'number' && p.price > 0
  );

  const totalPages = Math.ceil(data.total / limit);

  const goToPage = (newPage: number) => {
    router.push(
      `/products?categorySlug=${categorySlug}&page=${newPage}`
    );
  };

  return (
    <section className="p-4">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {products.map((p: any) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="border p-3 rounded hover:bg-gray-100 transition"
          >
            <p className="font-medium">{p.title}</p>
            <p className="text-sm">£{p.price}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ← Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
