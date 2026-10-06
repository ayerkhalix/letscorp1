import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { businesses, posts } from "@/data/mock";
import { QueryRoute } from "@/components/screens/query-route";
import { Skeleton } from "@/components/ui/states";
export function generateStaticParams() {
  return [
    ...[
      "eat",
      "work",
      "see",
      "travel",
      "chat",
      "create",
      "profile",
      "notifications",
      "settings",
      "help",
      "subscriptions",
      "advertise",
      "admin",
      "credits",
      "create/request",
      "create/orders",
      "create/order",
      "create/ai",
    ].map((x) => ({ path: x.split("/") })),
    ...businesses.map((b) => ({ path: ["business", b.id] })),
    ...posts.map((p) => ({ path: ["see", p.id] })),
    ...[...businesses.map((b) => b.id), "lets-create", "customer-mika"].map(
      (id) => ({ path: ["chat", id] }),
    ),
  ];
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const b =
    path[0] === "business"
      ? businesses.find((x) => x.id === path[1])
      : undefined;
  return {
    title:
      b?.name ||
      (path[0] === "create"
        ? "Let's Create"
        : path[0] === "business"
          ? "Local business"
          : `Let’s ${path[0][0].toUpperCase() + path[0].slice(1)}`),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  if (path[0] === "business" && !businesses.some((b) => b.id === path[1]))
    notFound();
  return (
    <Suspense
      fallback={
        <div
          className="screen-loading"
          aria-label="Loading your local experience"
        >
          <Skeleton className="loading-title" />
          <Skeleton className="loading-surface" />
        </div>
      }
    >
      <QueryRoute path={path} />
    </Suspense>
  );
}
