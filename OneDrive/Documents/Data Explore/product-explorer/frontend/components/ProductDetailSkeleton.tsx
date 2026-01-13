import { SkeletonBox } from './Skeleton';

export default function ProductDetailSkeleton() {
  return (
    <section className="p-4 max-w-3xl mx-auto">
      <SkeletonBox className="h-6 w-3/4 mb-4" />
      <SkeletonBox className="h-4 w-24 mb-6" />

      <SkeletonBox className="h-64 w-64 mb-6" />

      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-5/6" />
    </section>
  );
}
