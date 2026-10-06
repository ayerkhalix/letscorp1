"use client";
import { useSearchParams } from "next/navigation";
import { RouteScreen } from "./route-screen";
export function QueryRoute({ path }: { path: string[] }) {
  const query = useSearchParams();
  return (
    <RouteScreen key={`${path.join("/")}:${query.toString()}`} path={path} />
  );
}
