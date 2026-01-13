'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNavigation } from '../lib/api';
import Link from 'next/link';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['navigation'],
    queryFn: fetchNavigation,
  });

  if (isLoading) return <p>Loading navigation...</p>;

  if (error) {
    return (
      <p className="text-red-500">
        Failed to load navigation
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500">
        No navigation data found
      </p>
    );
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Browse</h1>

      <ul className="grid grid-cols-2 gap-4">
        {data.map((nav: any) => (
          <li key={nav._id}>
            <Link
              href={`/categories/${nav.slug}`}
              className="block p-4 border rounded hover:bg-gray-100"
            >
              {nav.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
