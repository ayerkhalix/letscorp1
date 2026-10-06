"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Bell,
  MapPin,
  ChevronDown,
  Home,
  Bookmark,
  HelpCircle,
  Settings,
  Sparkles,
  Check,
  Navigation,
} from "lucide-react";
import { services } from "@/components/navigation/services";
import { useApp } from "@/components/providers";
import { Dialog } from "@/components/ui/dialog";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Let's Corp home">
      <span className="brand-mark">
        l<span>c</span>
        <i />
      </span>
      {!compact && (
        <span>
          let’s<span className="brand-corp">corp</span>
          <b>●</b>
        </span>
      )}
    </Link>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { role, location, setLocation, conversations } = useApp();
  const [locationOpen, setLocationOpen] = useState(false);
  const active = path.split("/")[1];
  const unread = conversations.reduce((s, c) => s + c.unread, 0);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-topline">YOUR LOCAL, ALL IN ONE.</div>
        <Link href="/" className={`home-link ${path === "/" ? "active" : ""}`}>
          <Home size={19} />
          Discover
        </Link>
        <div className="nav-caption">THE LET’S ECOSYSTEM</div>
        <nav className="desktop-nav" aria-label="Services">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/${s.id}/`}
              className={`side-item ${active === s.id ? "active" : ""}`}
              aria-current={active === s.id ? "page" : undefined}
            >
              <s.icon size={20} />
              <span>{s.name}</span>
              {s.id === "eat" ? (
                <small>SOON</small>
              ) : s.id === "chat" && unread > 0 ? (
                <b className="unread-count">{unread}</b>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="sidebar-secondary">
          <Link href="/profile/">
            <Bookmark size={18} />
            Saved places
          </Link>
          <Link href="/settings/">
            <Settings size={18} />
            Settings
          </Link>
          <Link href="/help/">
            <HelpCircle size={18} />
            Help & support
          </Link>
        </div>
        <div className="sidebar-note">
          <span className="mini-sun">✳</span>
          <strong>
            Good things happen
            <br />
            when we connect.
          </strong>
          <p>
            Made for Puerto Princesa.
            <br />
            Inspired by our community.
          </p>
        </div>
        <Link href="/profile/" className="sidebar-account">
          <span className="avatar user-avatar">AS</span>
          <span>
            <strong>Alex Santos</strong>
            <small>{role} account</small>
          </span>
          <ChevronDown size={16} />
        </Link>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <div className="desktop-breadcrumb">Your island. Your community.</div>
          <div className="topbar-actions">
            <button
              className="location-button"
              onClick={() => setLocationOpen(true)}
              aria-label="Change location"
            >
              <MapPin size={17} />
              <span>
                <small>Exploring</small>
                <strong>{location}</strong>
              </span>
              <ChevronDown size={14} />
            </button>
            <span className="topbar-divider" />
            <Link
              href="/notifications/"
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <i />
            </Link>
            <Link
              href="/profile/"
              className="avatar user-avatar"
              aria-label="Open profile"
            >
              AS
            </Link>
          </div>
        </header>
        <main id="main-content" className="main-content">
          {children}
        </main>
        <footer className="page-footer">
          <Brand />
          <p>One island. Endless connections.</p>
          <span>Frontend prototype · Palawan, Philippines</span>
          <Link className="photo-credit-link" href="/credits/">
            Photo credits
          </Link>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Services">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/${s.id}/`}
            className={active === s.id ? "active" : ""}
            aria-current={active === s.id ? "page" : undefined}
          >
            <span>
              <s.icon size={21} />
              {s.id === "chat" && unread > 0 && <i />}
            </span>
            <small>{s.label}</small>
          </Link>
        ))}
      </nav>
      <Dialog
        open={locationOpen}
        onOpenChange={setLocationOpen}
        title="Explore your neighborhood"
        description="Choose a discovery area in Puerto Princesa."
      >
        <div className="location-options">
          {[
            "Puerto Princesa",
            "San Pedro",
            "San Manuel",
            "Bancao-Bancao",
            "Tiniguiban",
            "Honda Bay",
            "Sabang",
          ].map((x) => (
            <button
              key={x}
              onClick={() => {
                setLocation(x);
                setLocationOpen(false);
              }}
            >
              <MapPin size={18} />
              <span>
                {x}
                <small>Palawan, Philippines</small>
              </span>
              {location === x && <Check size={18} />}
            </button>
          ))}
        </div>
        <p className="small muted">
          <Navigation size={14} /> Locations are simulated for this prototype.
        </p>
      </Dialog>
    </>
  );
}
