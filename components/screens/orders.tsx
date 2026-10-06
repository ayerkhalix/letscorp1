"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  MessageCircle,
  Download,
  FileImage,
  RotateCcw,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers";
import { packages, money, orderStatuses } from "@/data/mock";
import { manilaDate } from "@/lib/utils";
import { PageTitle, BackLink, PrototypeNotice } from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { Dialog } from "@/components/ui/dialog";
export function OrdersScreen({ detail = false }: { detail?: boolean }) {
  const { orders, updateOrder, openConversation } = useApp();
  const [id, setId] = useState<string | null>(null);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revision, setRevision] = useState("");
  const router = useRouter();
  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);
  const order = id ? orders.find((o) => o.id === id) : orders[0];
  function chat() {
    openConversation("lets-create", "Let’s Create Studio", "LC");
    router.push("/chat/lets-create/");
  }
  if (!detail)
    return (
      <div>
        <BackLink href="/create/" label="Back to Let’s Create" />
        <PageTitle
          title="Your creative requests"
          description="Every good idea deserves a little follow-through."
        >
          <Link className="btn btn-primary" href="/create/">
            Start a new request
          </Link>
        </PageTitle>
        <div className="orders-list">
          {orders.map((o) => {
            const p = packages.find((p) => p.id === o.packageId)!;
            return (
              <Link
                key={o.id}
                href={`/create/order/?id=${o.id}`}
                className="order-list-card"
              >
                <span className="order-icon">
                  <Layers size={25} />
                </span>
                <div>
                  <span className="eyebrow">{o.id}</span>
                  <h3>{o.title}</h3>
                  <p>
                    {o.business} · {p.title} · {manilaDate(o.submitted)}
                  </p>
                </div>
                <div>
                  <span className="badge yellow">
                    {orderStatuses[o.status]}
                  </span>
                  <strong>{money(o.price)}</strong>
                  <small>Sample / test pricing · Prices are not final.</small>
                </div>
                <ChevronRight size={20} />
              </Link>
            );
          })}
          {!orders.length && (
            <EmptyState
              title="Your next great idea starts here"
              description="Choose a creative package to make your first request."
            />
          )}
        </div>
      </div>
    );
  if (!order)
    return (
      <div>
        <BackLink href="/create/orders/" label="Back to requests" />
        <EmptyState
          title="This request isn’t on this device"
          description="Prototype requests are stored locally. Browse your requests to continue."
        />
      </div>
    );
  const p = packages.find((p) => p.id === order.packageId)!;
  return (
    <div>
      <BackLink href="/create/orders/" label="Back to your requests" />
      <PageTitle title={order.id} description={order.title}>
        <Button onClick={chat}>
          <MessageCircle size={17} />
          Message Let’s Create
        </Button>
      </PageTitle>
      <div className="order-detail-layout">
        <section className="order-timeline-panel">
          <span className="badge yellow">{orderStatuses[order.status]}</span>
          <h2>Your idea is taking shape.</h2>
          <p className="muted">
            Follow your request from a first hello to the final details.
          </p>
          <ol className="order-timeline">
            {orderStatuses.map((s, i) => (
              <li
                key={s}
                className={
                  i < order.status
                    ? "complete"
                    : i === order.status
                      ? "current"
                      : ""
                }
              >
                <span>
                  {i < order.status ? (
                    <Check size={17} />
                  ) : i === order.status ? (
                    <Clock size={17} />
                  ) : (
                    i + 1
                  )}
                </span>
                <div>
                  <strong>{s}</strong>
                  <p>
                    {
                      [
                        "We’ve received your creative brief.",
                        "Your details and assets are being reviewed.",
                        "Your creative team is bringing the idea to life.",
                        "Share feedback so we can get it just right.",
                        "Adding the finishing touches.",
                        "Your content is ready to share.",
                      ][i]
                    }
                  </p>
                  {i === 0 && <small>{manilaDate(order.submitted)}</small>}
                </div>
              </li>
            ))}
          </ol>
          <div className="demo-status-controls">
            <label className="field">
              Preview a workflow status
              <select
                aria-label="Preview order status"
                value={order.status}
                onChange={(e) => updateOrder(order.id, Number(e.target.value))}
              >
                {orderStatuses.map((s, i) => (
                  <option value={i} key={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <p className="small muted">
              Demo control · changes this local request only.
            </p>
          </div>
        </section>
        <section className="order-information">
          <div className="info-panel">
            <h3>Request details</h3>
            <dl>
              <div>
                <dt>Business</dt>
                <dd>
                  {order.business}
                  {order.business === "Palawan Brew Café" && (
                    <Link href="/business/palawan-brew/">View business</Link>
                  )}
                </dd>
              </div>
              <div>
                <dt>Package</dt>
                <dd>{p.title}</dd>
              </div>
              <div>
                <dt>Deliverables</dt>
                <dd>{p.deliverable}</dd>
              </div>
              <div>
                <dt>Sample price</dt>
                <dd>
                  {money(order.price)}
                  <small>Sample / test pricing. Prices are not final.</small>
                </dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{manilaDate(order.submitted)}</dd>
              </div>
              <div>
                <dt>Requested delivery</dt>
                <dd>To be confirmed · placeholder</dd>
              </div>
            </dl>
            <h4>Your instructions</h4>
            <p className="pre-wrap muted">{order.instructions}</p>
            <h4>Uploaded assets</h4>
            <div className="order-assets">
              {order.assets.length ? (
                order.assets.map((a, i) => (
                  <div key={i}>
                    <img src={a.url} alt={a.name} />
                    <span>{a.name}</span>
                  </div>
                ))
              ) : (
                <p className="muted">No assets attached.</p>
              )}
            </div>
          </div>
          {order.status >= 3 && (
            <div className="info-panel">
              <h3>
                {order.status === 5
                  ? "Your final content"
                  : "A first look at your content"}
              </h3>
              <div className="order-content-preview">
                <img
                  src={
                    order.assets.find((a) => !a.url.includes("favicon"))?.url ||
                    "/images/coffee.jpg"
                  }
                  alt="Sample promotional content preview"
                />
                <div>
                  <small>{order.business}</small>
                  <strong>{order.title}</strong>
                  <span>CREATIVE PREVIEW · PROTOTYPE</span>
                </div>
              </div>
              <div className="order-preview-actions">
                <Button variant="outline" onClick={() => setRevisionOpen(true)}>
                  <RotateCcw size={16} />
                  Request revision
                </Button>
                <Button
                  disabled={order.status !== 5}
                  onClick={() => {
                    const blob = new Blob(
                      [
                        `LET'S CORP — DEMO CONTENT DELIVERY\n${order.id}\n${order.business}\n${order.title}\n\n${order.instructions}\n\nThis is a prototype download summary, not a finished creative deliverable.`,
                      ],
                      { type: "text/plain" },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${order.id}-demo-summary.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Demo delivery summary downloaded.");
                  }}
                >
                  <Download size={16} />
                  Download demo
                </Button>
              </div>
            </div>
          )}
          {order.revisions.length > 0 && (
            <div className="info-panel">
              <h3>Revision requests</h3>
              {order.revisions.map((r, i) => (
                <p key={i} className="revision-note">
                  {r}
                </p>
              ))}
            </div>
          )}
          <PrototypeNotice>
            Prototype order tracking. Status updates, revisions, and downloads
            are simulated.
          </PrototypeNotice>
        </section>
      </div>
      <Dialog
        open={revisionOpen}
        onOpenChange={setRevisionOpen}
        title="Let’s get the details right"
        description="Tell us what you’d like to change."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (revision.trim()) {
              updateOrder(order.id, 3, revision.trim());
              setRevision("");
              setRevisionOpen(false);
              toast.success("Revision added to your demo request.");
            }
          }}
        >
          <label className="field">
            Your feedback
            <textarea
              required
              value={revision}
              onChange={(e) => setRevision(e.target.value)}
              rows={4}
              placeholder="e.g. Make the offer larger and use a warmer background…"
            />
          </label>
          <Button className="full-width">Send revision request</Button>
        </form>
      </Dialog>
    </div>
  );
}
