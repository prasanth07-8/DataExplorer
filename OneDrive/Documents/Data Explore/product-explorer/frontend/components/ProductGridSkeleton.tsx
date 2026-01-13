import { SkeletonBox } from './Skeleton';

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="border p-3 rounded"
        >
          <SkeletonBox className="h-4 mb-2 w-full" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
