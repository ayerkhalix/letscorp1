"use client";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { ReactNode } from "react";
export function SectionTitle({
  eyebrow,
  title,
  description,
  href,
  action = "View all",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  action?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link href={href} className="text-link">
          {action}
        </Link>
      )}
      {children}
    </div>
  );
}
export function PageTitle({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">YOUR LOCAL CONNECTION</span>
        <h1>
          {title}
          {badge && <span className="badge yellow">{badge}</span>}
        </h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search businesses...",
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="search-input">
      <Search size={20} />
      <input
        aria-label={placeholder.replace("...", "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search">
          ×
        </button>
      )}
      {children}
    </div>
  );
}
export function Chips({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="chips" aria-label="Categories">
      {options.map((o) => (
        <button
          aria-pressed={value === o}
          className={value === o ? "selected" : ""}
          key={o}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
export function BackLink({
  href = "/",
  label = "Back to discover",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link className="back-link" href={href}>
      <ArrowLeft size={17} />
      {label}
    </Link>
  );
}
export function PrototypeNotice({ children }: { children: ReactNode }) {
  return (
    <div className="prototype-notice">
      <CheckCircle2 size={17} />
      <span>{children}</span>
    </div>
  );
}
