import { SearchX } from "lucide-react";
export function EmptyState({
  title = "Nothing here just yet",
  description = "Try a different search or category.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty-state">
      <SearchX size={30} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-label="Loading" />;
}
