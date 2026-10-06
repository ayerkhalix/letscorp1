"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { useApp } from "@/components/providers";
import { businesses } from "@/data/mock";
import { services } from "@/components/navigation/services";
type Tool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
export function WebMCP() {
  const app = useApp();
  const latest = useRef(app);
  latest.current = app;
  const router = useRouter();
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Tool) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {}
    };
    register({
      name: "search_local_places",
      description:
        "Search the prototype directory for local businesses and Palawan travel providers.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        if (
          !input ||
          typeof input !== "object" ||
          typeof (input as { query?: unknown }).query !== "string"
        )
          throw new Error("query must be a string");
        const q = (input as { query: string }).query.toLowerCase();
        return {
          places: businesses
            .filter((b) =>
              `${b.name} ${b.category} ${b.address}`.toLowerCase().includes(q),
            )
            .map((b) => ({
              id: b.id,
              name: b.name,
              category: b.category,
              url: `/business/${b.id}/`,
            })),
        };
      },
    });
    register({
      name: "navigate_service",
      description: "Open one of the six Let’s Corp service screens.",
      inputSchema: {
        type: "object",
        properties: {
          service: { type: "string", enum: services.map((s) => s.id) },
        },
        required: ["service"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const s =
          input && typeof input === "object"
            ? (input as { service?: unknown }).service
            : null;
        if (typeof s !== "string" || !services.some((x) => x.id === s))
          throw new Error("Choose eat, work, see, travel, chat, or create");
        router.push(`/${s}/`);
        return { service: s, url: `/${s}/`, action: "Navigation started" };
      },
    });
    register({
      name: "save_local_places",
      description:
        "Save known directory businesses to the visible account’s device-local favorites.",
      inputSchema: {
        type: "object",
        properties: {
          ids: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 16,
          },
        },
        required: ["ids"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const ids =
          input && typeof input === "object"
            ? (input as { ids?: unknown }).ids
            : null;
        if (
          !Array.isArray(ids) ||
          !ids.length ||
          ids.length > 16 ||
          ids.some(
            (id) =>
              typeof id !== "string" || !businesses.some((b) => b.id === id),
          )
        )
          throw new Error("Provide 1–16 known directory IDs");
        const unique = [...new Set(ids as string[])];
        flushSync(() =>
          unique.forEach((id) => {
            if (!latest.current.saved.includes(id))
              latest.current.toggleSave(id);
          }),
        );
        return { saved: unique };
      },
    });
    return () => lifecycle.abort();
  }, [router]);
  return null;
}
