"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Bell,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
  Store,
  User,
  Shield,
  BadgeCheck,
  Megaphone,
  MessageCircle,
  Pencil,
  Check,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers";
import { businesses, posts, money, orderStatuses } from "@/data/mock";
import type { Role } from "@/types";
import { BusinessCard } from "@/components/business/business-card";
import { PostCard } from "@/components/feed/post-card";
import {
  PageTitle,
  SectionTitle,
  PrototypeNotice,
} from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/states";
export function ProfileScreen() {
  const { role, setRole, saved, savedPosts, orders, conversations } = useApp();
  const [tab, setTab] = useState("places");
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("Palawan Brew Café");
  const [description, setDescription] = useState(businesses[0].description);
  const [hours, setHours] = useState(businesses[0].hours);
  const [listingSaved, setListingSaved] = useState(false);
  const router = useRouter();
  useEffect(() => {
    try {
      const listing = JSON.parse(
        localStorage.getItem("lets-corp-business-listing") || "null",
      );
      if (listing) {
        setName(listing.name);
        setDescription(listing.description);
        setHours(listing.hours);
        setListingSaved(true);
      }
    } catch {}
  }, []);
  return (
    <div className="profile-screen">
      <PageTitle
        title="Your local corner"
        description="Your connections, your favorites, your possibilities."
      />
      <section className="profile-hero">
        <span className="avatar large-avatar user-avatar">AS</span>
        <div>
          <span className="eyebrow">HELLO, NEIGHBOR</span>
          <h1>Alex Santos</h1>
          <p>
            <Mail size={14} />
            alex@example.test <span>·</span>
            <MapPin size={14} />
            Puerto Princesa
          </p>
          <span className="badge subtle">{role} account · demo</span>
        </div>
        <Link className="btn btn-outline" href="/settings/">
          <Settings size={16} />
          Account settings
        </Link>
      </section>
      <div className="profile-layout">
        <div>
          <div className="role-switcher">
            <div>
              <h3>Explore a different perspective</h3>
              <p>Switch mock accounts to experience the ecosystem.</p>
            </div>
            <div>
              {(["Customer", "Business", "Admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  className={role === r ? "selected" : ""}
                  aria-pressed={role === r}
                  onClick={() => {
                    setRole(r);
                    toast.success(`Switched to ${r.toLowerCase()} demo.`);
                  }}
                >
                  {r === "Customer" ? (
                    <User size={16} />
                  ) : r === "Business" ? (
                    <Store size={16} />
                  ) : (
                    <Shield size={16} />
                  )}
                  <span>{r}</span>
                </button>
              ))}
            </div>
          </div>
          {role === "Business" && (
            <section className="business-management">
              <SectionTitle title="Your business, connected" />
              <div className="managed-business">
                <img src="/images/coffee.jpg" alt="Palawan Brew Café" />
                <div>
                  <span className="badge yellow">Gold · placeholder tier</span>
                  <h3>
                    {name}
                    <BadgeCheck size={17} />
                  </h3>
                  <p>
                    {listingSaved
                      ? description
                      : "A little coffee. A lot of local community."}
                  </p>
                  {listingSaved && <small className="muted">{hours}</small>}
                  <div>
                    <Link
                      href="/business/palawan-brew/"
                      className="btn btn-outline"
                    >
                      View profile
                    </Link>
                    <Button variant="outline" onClick={() => setEdit(true)}>
                      <Pencil size={15} />
                      Manage listing
                    </Button>
                  </div>
                </div>
              </div>
              <div className="management-tools">
                <Link href="/subscriptions/">
                  <Store size={21} />
                  <strong>Your subscription</strong>
                  <small>Explore example listing tiers</small>
                </Link>
                <Link href="/chat/">
                  <MessageCircle size={21} />
                  <strong>
                    {conversations.filter((c) => c.type === "Customers").length}{" "}
                    customer conversation
                  </strong>
                  <small>Reply and build connections</small>
                </Link>
                <Link href="/advertise/">
                  <Megaphone size={21} />
                  <strong>Promote your business</strong>
                  <small>Be part of the local buzz</small>
                </Link>
                <Link href="/create/orders/">
                  <Layers size={21} />
                  <strong>
                    {orders.length} creative request
                    {orders.length !== 1 ? "s" : ""}
                  </strong>
                  <small>Follow every creative step</small>
                </Link>
              </div>
            </section>
          )}
          {role === "Admin" && (
            <div className="admin-preview-callout">
              <Shield size={29} />
              <div>
                <h3>A view of the local ecosystem</h3>
                <p>A compact admin overview for demonstrations.</p>
              </div>
              <Link className="btn btn-primary" href="/admin/">
                Open admin preview
              </Link>
            </div>
          )}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="profile-tabs">
              <TabsTrigger value="places">
                <Bookmark size={16} />
                Saved places ({saved.length})
              </TabsTrigger>
              <TabsTrigger value="posts">
                Saved posts ({savedPosts.length})
              </TabsTrigger>
              <TabsTrigger value="orders">
                Creative requests ({orders.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="places">
              <div className="business-grid profile-saved-grid">
                {businesses
                  .filter((b) => saved.includes(b.id))
                  .map((b) => (
                    <BusinessCard key={b.id} business={b} />
                  ))}
              </div>
              {!saved.length && (
                <EmptyState
                  title="A place for your favorite places"
                  description="Save a business while exploring. You’ll find it right here."
                />
              )}
            </TabsContent>
            <TabsContent value="posts">
              <div className="saved-feed">
                {posts
                  .filter((p) => savedPosts.includes(p.id))
                  .map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
              </div>
              {!savedPosts.length && (
                <EmptyState
                  title="Keep a little local inspiration"
                  description="Save promotions and updates in Let’s See."
                />
              )}
            </TabsContent>
            <TabsContent value="orders">
              <div className="profile-order-list">
                {orders.map((o) => (
                  <Link key={o.id} href={`/create/order/?id=${o.id}`}>
                    <Layers size={22} />
                    <span>
                      <strong>{o.title}</strong>
                      <small>{o.id}</small>
                    </span>
                    <span className="badge yellow">
                      {orderStatuses[o.status]}
                    </span>
                    <ChevronRight size={17} />
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <aside className="profile-menu">
          <h3>Make yourself at home.</h3>
          {[
            { icon: Bell, label: "Notifications", href: "/notifications/" },
            { icon: Settings, label: "Settings", href: "/settings/" },
            { icon: HelpCircle, label: "Help & support", href: "/help/" },
            {
              icon: Layers,
              label: "My creative requests",
              href: "/create/orders/",
            },
          ].map((x) => (
            <Link href={x.href} key={x.href}>
              <x.icon size={18} />
              {x.label}
              <ChevronRight size={16} />
            </Link>
          ))}
          <button
            onClick={() => {
              setRole("Customer");
              toast.success(
                "Signed out of the mock account. Your demo data is kept.",
              );
              router.push("/");
            }}
          >
            <LogOut size={18} />
            Sign out of demo
          </button>
          <p>
            Let’s Corp prototype
            <br />
            Made for Puerto Princesa, Palawan.
          </p>
        </aside>
      </div>
      <Dialog
        open={edit}
        onOpenChange={setEdit}
        title="Manage your local listing"
        description="Save a business-management draft on this device."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              localStorage.setItem(
                "lets-corp-business-listing",
                JSON.stringify({ name, description, hours }),
              );
              setListingSaved(true);
              setEdit(false);
              toast.success("Listing draft saved in your business account.");
            } catch {
              toast.error("Could not save your draft.");
            }
          }}
        >
          <label className="field">
            Business name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            Description
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="field">
            Opening hours
            <input
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </label>
          <p className="small muted">
            This is a management draft. Public demo listings use the shared
            sample directory.
          </p>
          <Button className="full-width">Save listing draft</Button>
        </form>
      </Dialog>
    </div>
  );
}
export function NotificationsScreen() {
  const [read, setRead] = useState<string[]>([]);
  const notifications = [
    {
      id: "1",
      icon: MessageCircle,
      title: "A little hello from Palawan Brew",
      description: "“We’d love to save you a table. What time works for you?”",
      time: "Just now",
      href: "/chat/palawan-brew/",
    },
    {
      id: "2",
      icon: Layers,
      title: "Your idea is taking shape",
      description: "Creative request LC-2026-0142 is now in production.",
      time: "1 hour ago",
      href: "/create/order/?id=LC-2026-0142",
    },
    {
      id: "3",
      icon: Megaphone,
      title: "A sweeter weekend, nearby",
      description: "Palawan Brew posted a new coffee + pastry promotion.",
      time: "2 hours ago",
      href: "/see/coffee-weekend/",
    },
    {
      id: "4",
      icon: Store,
      title: "A place you saved has something new",
      description: "Explore the new menu at Kusina Palawan.",
      time: "Yesterday",
      href: "/see/new-menu/",
    },
    {
      id: "5",
      icon: Check,
      title: "Preview a completed creative request",
      description: "See how final content and demo downloads will work.",
      time: "Demo example",
      href: "/create/orders/",
    },
    {
      id: "6",
      icon: Bell,
      title: "Welcome to your local, all in one",
      description: "Six ways to discover, connect, and create in Palawan.",
      time: "Yesterday",
      href: "/",
    },
  ];
  return (
    <div>
      <PageTitle
        title="A little local update"
        description="The things worth keeping up with."
      >
        <Button
          variant="outline"
          onClick={() => {
            setRead(notifications.map((n) => n.id));
            toast.success("All notifications marked as read.");
          }}
        >
          Mark all as read
        </Button>
      </PageTitle>
      <div className="notification-list">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.href}
            className={read.includes(n.id) ? "read" : ""}
            onClick={() => setRead((r) => [...r, n.id])}
          >
            <span className="notification-icon">
              <n.icon size={21} />
            </span>
            <div>
              <h3>{n.title}</h3>
              <p>{n.description}</p>
              <small>{n.time}</small>
            </div>
            {!read.includes(n.id) && <i />}
            <ChevronRight size={18} />
          </Link>
        ))}
      </div>
      <PrototypeNotice>
        Sample notifications for the frontend demo.
      </PrototypeNotice>
    </div>
  );
}
export function SettingsScreen() {
  const [name, setName] = useState("Alex Santos");
  const [email, setEmail] = useState("alex@example.test");
  const [updates, setUpdates] = useState(true);
  const [offers, setOffers] = useState(true);
  useEffect(() => {
    try {
      const s = JSON.parse(
        localStorage.getItem("lets-corp-settings") || "null",
      );
      if (s) {
        setName(s.name);
        setEmail(s.email);
        setUpdates(s.updates);
        setOffers(s.offers);
      }
    } catch {}
  }, []);
  return (
    <div>
      <PageTitle
        title="Make it feel like you"
        description="A few preferences for your local experience."
      />
      <form
        className="settings-panel"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            localStorage.setItem(
              "lets-corp-settings",
              JSON.stringify({ name, email, updates, offers }),
            );
            toast.success("Demo preferences saved on this device.");
          } catch {
            toast.error("Could not save preferences.");
          }
        }}
      >
        <h2>Account information</h2>
        <label className="field">
          Display name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <h2>Stay in the local loop</h2>
        <label className="settings-toggle">
          <span>
            <strong>Messages & creative requests</strong>
            <small>Keep up with conversations and order progress.</small>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
          />
        </label>
        <label className="settings-toggle">
          <span>
            <strong>Local offers & discoveries</strong>
            <small>Sample promotions from your neighborhood.</small>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={offers}
            onChange={(e) => setOffers(e.target.checked)}
          />
        </label>
        <PrototypeNotice>
          Preferences are local to this prototype. No emails or push
          notifications are sent.
        </PrototypeNotice>
        <Button>Save preferences</Button>
      </form>
    </div>
  );
}
export function HelpScreen() {
  const { openConversation } = useApp();
  const router = useRouter();
  return (
    <div>
      <PageTitle
        title="A little help, right here"
        description="Find your way around the Let’s Corp community."
      />
      <div className="help-layout">
        <section className="help-faq">
          {[
            {
              q: "What is Let’s Corp?",
              a: "One platform connecting local businesses and customers in Puerto Princesa and Palawan. Discover businesses, promotions, travel, conversations, and creative services through six connected destinations.",
            },
            {
              q: "Can I order food or book a trip?",
              a: "Let’s Eat is coming soon. Travel is a discovery experience: browse providers, see their location, and message them. This prototype does not process bookings, deliveries, or payments.",
            },
            {
              q: "How do creative requests work?",
              a: "Choose a package in Let’s Create, share your brief and assets, review, and submit. Track the request and talk to the studio through Let’s Chat. Prices and deliverables are samples, and requests stay on your device.",
            },
            {
              q: "Are these real businesses?",
              a: "Business names, offers, conversations, and subscriptions are fictional demonstration data. Photos illustrate business categories and Palawan destinations. This prototype is for product presentations.",
            },
            {
              q: "What happens when the map is unavailable?",
              a: "An interactive simulated map appears automatically if live tiles cannot load. You can select markers, zoom, pan, and open business profiles.",
            },
            {
              q: "Where is my demo data stored?",
              a: "Saved places, posts, messages, creative requests, and drafts stay in this browser on this device. Clearing browser storage resets the demo. No production account or backend is connected.",
            },
          ].map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
        <aside className="help-contact">
          <MessageCircle size={30} />
          <h2>Let’s talk it through.</h2>
          <p>Try a conversation with our creative studio in the demo.</p>
          <Button
            onClick={() => {
              openConversation("lets-create", "Let’s Create Studio", "LC");
              router.push("/chat/lets-create/");
            }}
          >
            Open demo support chat
          </Button>
          <Link className="text-link" href="/">
            Back to your neighborhood
          </Link>
        </aside>
      </div>
    </div>
  );
}
