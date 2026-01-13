'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProductDetail } from '../../../lib/api';
import ProductDetailSkeleton from '../../../components/ProductDetailSkeleton';

export default function ProductDetailClient() {
  const params = useParams();
  const productId = params.productId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetail(productId),
    enabled: !!productId,
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !data)
    return <p className="p-4 text-red-500">Failed to load product</p>;

  const { product, detail } = data;

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-lg font-semibold mb-4">£{product.price}</p>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-64 mb-6 rounded border"
        />
      )}

      {detail?.description && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{detail.description}</p>
        </div>
      )}

      {detail?.specs && (
        <div>
          <h2 className="font-semibold mb-2">Details</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {Object.entries(detail.specs).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
