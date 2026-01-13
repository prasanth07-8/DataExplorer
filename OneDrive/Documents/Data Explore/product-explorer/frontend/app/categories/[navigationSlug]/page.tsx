'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../../lib/api';
import Link from 'next/link';

export default function CategoriesPage() {
  const params = useParams();
  const navigationSlug = params.navigationSlug as string;

  const {
    data = [],          // ✅ DEFAULT EMPTY ARRAY
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories', navigationSlug],
    queryFn: () => fetchCategories(navigationSlug),
    enabled: !!navigationSlug,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Failed to load categories</p>;

  return (
    <section>
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {data.length === 0 && (
        <p className="text-gray-500">No categories found.</p>
      )}

      <ul className="grid grid-cols-2 gap-4">
        {data.map((cat: any) => (
          <li key={cat._id}>
            <Link
              href={`/products?categorySlug=${cat.slug}`}
              className="block p-4 border rounded hover:bg-gray-100"
            >
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
