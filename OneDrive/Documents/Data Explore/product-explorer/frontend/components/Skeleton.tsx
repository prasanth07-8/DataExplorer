export function SkeletonBox({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}
