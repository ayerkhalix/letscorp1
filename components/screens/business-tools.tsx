"use client";
import { useState } from "react";
import {
  Store,
  BadgeCheck,
  Check,
  Sparkles,
  Megaphone,
  Image,
  LayoutGrid,
  Tag,
  Users,
  MessageCircle,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers";
import { businesses, posts, orderStatuses } from "@/data/mock";
import { PageTitle, PrototypeNotice } from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function SubscriptionScreen() {
  const [plan, setPlan] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const tiers = [
    {
      name: "Entry",
      price: "₱100",
      note: "Minimum monthly listing",
      features: ["Business listing", "Contact & location", "Basic profile"],
    },
    {
      name: "Bronze",
      price: "₱250",
      features: [
        "Expanded photo gallery",
        "More listing details",
        "Example promotional exposure",
      ],
    },
    {
      name: "Silver",
      price: "₱500",
      features: [
        "Example category placement",
        "Example profile insights",
        "Example Let’s See visibility",
      ],
    },
    {
      name: "Gold",
      price: "₱1,000",
      features: [
        "Example featured placement",
        "Example promotional exposure",
        "Example analytics",
      ],
    },
    {
      name: "Platinum",
      price: "₱2,000",
      features: [
        "Example priority placement",
        "Example campaign support",
        "Example expanded visibility",
      ],
    },
  ];
  return (
    <div>
      <PageTitle
        title="Make your business part of local."
        description="Get your business listed on Let’s Work."
      />
      <div className="subscription-intro">
        <Store size={34} />
        <div>
          <h2>Seen locally. Connected meaningfully.</h2>
          <p>A home for your business in the neighborhood’s everyday life.</p>
        </div>
      </div>
      <PrototypeNotice>
        <strong>Pricing and benefits are subject to finalization.</strong>{" "}
        Bronze through Platinum values are fictional placeholders. Speculative
        benefits are example features.
      </PrototypeNotice>
      <div className="pricing-grid">
        {tiers.map((t, i) => (
          <article
            key={t.name}
            className={`pricing-card ${i === 0 ? "entry-tier" : ""}`}
          >
            <span className="eyebrow">{t.name.toUpperCase()}</span>
            <h2>
              {t.price}
              <small>/month</small>
            </h2>
            <p>
              {i === 0
                ? "Entry listing minimum"
                : "Fictional placeholder pricing"}
            </p>
            <ul>
              {t.features.map((f) => (
                <li key={f}>
                  <Check size={15} />
                  {f}
                  {i > 0 && !f.startsWith("Example") && (
                    <small>Example feature</small>
                  )}
                </li>
              ))}
            </ul>
            <Button
              variant={i === 0 ? "primary" : "outline"}
              className="full-width"
              onClick={() => setPlan(t.name)}
            >
              Choose Plan
            </Button>
          </article>
        ))}
      </div>
      <Dialog
        open={!!plan}
        onOpenChange={() => setPlan(null)}
        title={`Interested in ${plan}?`}
        description="Register your interest in this example listing plan."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(
              `${plan} interest recorded for the demo. No payment or signup was processed.`,
            );
            setPlan(null);
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
            Contact email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <p className="small muted">
            Pricing and benefits are subject to finalization. Prototype interest
            form only.
          </p>
          <Button className="full-width">Register demo interest</Button>
        </form>
      </Dialog>
    </div>
  );
}
export function AdvertisingScreen() {
  const [product, setProduct] = useState<string | null>(null);
  return (
    <div>
      <PageTitle
        title="Be part of the local buzz."
        description="Put your business in front of more local customers."
      />
      <div className="advertising-hero">
        <Megaphone size={44} />
        <div>
          <span className="eyebrow">LET’S SEE YOUR BUSINESS GROW</span>
          <h2>
            Your story deserves
            <br />a place in the neighborhood.
          </h2>
          <p>
            Discover conceptual advertising products for the Let’s Corp
            ecosystem.
          </p>
        </div>
      </div>
      <PrototypeNotice>
        Conceptual advertising products. Placement, pricing, targeting, and
        benefits are not finalized.
      </PrototypeNotice>
      <div className="ad-product-grid">
        {[
          {
            name: "Featured Feed Post",
            icon: Image,
            description:
              "A beautiful business story in the local discovery feed.",
          },
          {
            name: "Sponsored Business",
            icon: Store,
            description:
              "An example of extra visibility for your local listing.",
          },
          {
            name: "Promotional Banner",
            icon: LayoutGrid,
            description:
              "An example campaign spotlight across discovery surfaces.",
          },
          {
            name: "Featured Category",
            icon: Tag,
            description:
              "A conceptual place for your business in a relevant category.",
          },
        ].map((p) => (
          <article key={p.name}>
            <p.icon size={30} />
            <span className="badge subtle">Concept product</span>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <Button variant="outline" onClick={() => setProduct(p.name)}>
              Explore this idea
            </Button>
          </article>
        ))}
      </div>
      <Dialog
        open={!!product}
        onOpenChange={() => setProduct(null)}
        title={product || "Advertise locally"}
        description="Explore a conceptual local campaign."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(
              "Your demo campaign interest has been recorded. No advertisement has been placed.",
            );
            setProduct(null);
          }}
        >
          <label className="field">
            Business name
            <input required placeholder="Your local business" />
          </label>
          <label className="field">
            Contact email
            <input type="email" required placeholder="you@yourbusiness.com" />
          </label>
          <label className="field">
            What would you like to promote?
            <textarea
              required
              rows={3}
              placeholder="Tell us a little about your campaign…"
            />
          </label>
          <Button className="full-width">Send demo enquiry</Button>
        </form>
      </Dialog>
    </div>
  );
}
export function AdminScreen() {
  const { orders, conversations } = useApp();
  const [tab, setTab] = useState("Businesses");
  const counts = [
    { label: "Local businesses", value: businesses.length, icon: Store },
    { label: "Demo accounts", value: 3, icon: Users },
    { label: "Creative requests", value: orders.length, icon: Layers },
    { label: "Local promotions", value: posts.length, icon: Megaphone },
  ];
  return (
    <div>
      <PageTitle
        title="The ecosystem at a glance"
        description="A compact admin preview for demonstration."
        badge="Admin preview"
      />
      <PrototypeNotice>
        Example admin data. This is a frontend overview with no production
        administration or access control.
      </PrototypeNotice>
      <div className="admin-stats">
        {counts.map((c) => (
          <article key={c.label}>
            <c.icon size={23} />
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </article>
        ))}
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="admin-tabs">
          {[
            "Businesses",
            "Users",
            "Orders",
            "Advertisements",
            "Messages",
            "Subscriptions",
          ].map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {(tab === "Businesses"
                ? ["Business", "Category", "Location", "Tier"]
                : tab === "Orders"
                  ? ["Request", "Business", "Package", "Status"]
                  : tab === "Advertisements"
                    ? ["Promotion", "Type", "Placement", "Status"]
                    : tab === "Messages"
                      ? ["Conversation", "Relationship", "Messages", "Unread"]
                      : tab === "Subscriptions"
                        ? ["Business", "Tier", "Type", "Status"]
                        : ["Name", "Role", "Location", "Status"]
              ).map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tab === "Businesses"
              ? businesses.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.category}</td>
                    <td>{b.address.split(",")[0]}</td>
                    <td>{b.subscriptionTier}</td>
                  </tr>
                ))
              : tab === "Orders"
                ? orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.business}</td>
                      <td>{o.packageId}</td>
                      <td>
                        <span className="badge yellow">
                          {orderStatuses[o.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                : tab === "Advertisements"
                  ? posts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.title}</td>
                        <td>{p.type}</td>
                        <td>
                          {p.sponsored ? "Sponsored demo" : "Organic demo"}
                        </td>
                        <td>Example</td>
                      </tr>
                    ))
                  : tab === "Messages"
                    ? conversations.map((c) => (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.type}</td>
                          <td>{c.messages.length}</td>
                          <td>{c.unread}</td>
                        </tr>
                      ))
                    : tab === "Subscriptions"
                      ? businesses.map((b) => (
                          <tr key={b.id}>
                            <td>{b.name}</td>
                            <td>{b.subscriptionTier}</td>
                            <td>
                              {b.subscriptionTier === "Entry"
                                ? "₱100 minimum"
                                : "Placeholder tier"}
                            </td>
                            <td>Demo active</td>
                          </tr>
                        ))
                      : ["Customer", "Business", "Admin"].map((r) => (
                          <tr key={r}>
                            <td>Alex Santos · demo</td>
                            <td>{r}</td>
                            <td>Puerto Princesa</td>
                            <td>Mock account</td>
                          </tr>
                        ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
