"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Upload,
  ImagePlus,
  X,
  CheckCircle2,
  MessageCircle,
  FileImage,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers";
import { packages, money } from "@/data/mock";
import { BackLink, PageTitle, PrototypeNotice } from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { manilaDate } from "@/lib/utils";
const steps = [
  "Business info",
  "Promotion details",
  "Your assets",
  "Brand preferences",
  "Review request",
];
export function RequestScreen() {
  const { draft, setDraft, addOrder, openConversation } = useApp();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const router = useRouter();
  const p = packages.find((x) => x.id === draft.packageId) || packages[0];
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("package");
    if (id && packages.some((p) => p.id === id))
      setDraft((d) => ({ ...d, packageId: id }));
  }, []);
  const set = (field: keyof typeof draft, value: string) =>
    setDraft((d) => ({ ...d, [field]: value }));
  const ready =
    step === 0
      ? !!draft.business.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact)
      : step === 1
        ? !!draft.title.trim() && !!draft.description.trim()
        : true;
  function upload(files: FileList | null) {
    if (!files) return;
    Array.from(files)
      .slice(0, 6 - draft.assets.length)
      .forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Choose an image for your logo or product photos.");
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Choose images under 2 MB for this demo.");
          return;
        }
        const reader = new FileReader();
        reader.onload = () =>
          setDraft((d) => ({
            ...d,
            assets: [
              ...d.assets,
              { name: file.name, url: String(reader.result) },
            ].slice(0, 6),
          }));
        reader.readAsDataURL(file);
      });
  }
  function submit() {
    setSubmitting(true);
    setTimeout(() => {
      const id = `LC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const now = new Date().toISOString();
      addOrder({
        id,
        packageId: p.id,
        business: draft.business,
        title: draft.title,
        price: p.price,
        submitted: now,
        status: 0,
        instructions: [
          draft.description,
          `Audience: ${draft.audience}`,
          `Important text: ${draft.importantText}`,
          `Colors: ${draft.colors}`,
          draft.instructions,
        ]
          .filter(Boolean)
          .join("\n"),
        assets: draft.assets,
        revisions: [],
      });
      setDate(now);
      setSubmitted(id);
      setSubmitting(false);
    }, 1100);
  }
  if (submitted)
    return (
      <div className="request-success">
        <span className="success-icon">
          <CheckCircle2 size={42} />
        </span>
        <span className="eyebrow">LET’S MAKE SOMETHING GREAT</span>
        <h1>Your request has been submitted.</h1>
        <p>
          Your idea is in good hands. Follow its progress
          <br />
          and keep the conversation going.
        </p>
        <div className="success-summary">
          <p>
            <span>Request number</span>
            <strong>{submitted}</strong>
          </p>
          <p>
            <span>Selected service</span>
            <strong>{p.title}</strong>
          </p>
          <p>
            <span>Submitted</span>
            <strong>{manilaDate(date)}</strong>
          </p>
          <p>
            <span>Current status</span>
            <span className="badge yellow">Submitted</span>
          </p>
        </div>
        <Link
          className="btn btn-primary"
          href={`/create/order/?id=${submitted}`}
        >
          View Order
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            openConversation("lets-create", "Let’s Create Studio", "LC");
            router.push("/chat/lets-create/");
          }}
        >
          <MessageCircle size={17} />
          Message Let’s Create
        </Button>
        <p className="small muted">
          Prototype submission · no payment or live order processing
        </p>
      </div>
    );
  return (
    <div className="request-screen">
      <BackLink href="/create/" label="Back to creative services" />
      <PageTitle
        title="Let’s make it yours."
        description="A simple brief. A great starting point."
      />
      <div
        className="request-progress"
        aria-label={`Step ${step + 1} of ${steps.length}`}
      >
        {steps.map((s, i) => (
          <div
            key={s}
            className={`${i === step ? "current" : i < step ? "done" : ""}`}
          >
            <span>{i < step ? <Check size={15} /> : i + 1}</span>
            <small>{s}</small>
          </div>
        ))}
      </div>
      <div className="request-layout">
        <form
          className="request-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 4) {
              if (ready) setStep((s) => s + 1);
            } else submit();
          }}
        >
          <span className="eyebrow">STEP {step + 1} OF 5</span>
          <h2>
            {
              [
                "First, tell us about your business.",
                "What’s the big little idea?",
                "Show us what you’re working with.",
                "A look that feels like you.",
                "Everything looking good?",
              ][step]
            }
          </h2>
          <p className="muted">
            {
              [
                "We’ll use this information to personalize your content.",
                "The more you share, the better we can tell your story.",
                "Add your logo and product photos, or try our sample assets.",
                "Share your colors, your style, and the details that matter.",
                "Review your brief before submitting this demo request.",
              ][step]
            }
          </p>
          {step === 0 && (
            <>
              <label className="field">
                Business name *
                <input
                  required
                  value={draft.business}
                  onChange={(e) => set("business", e.target.value)}
                  placeholder="e.g. Palawan Brew Café"
                />
              </label>
              <label className="field">
                Contact email *
                <input
                  type="email"
                  required
                  value={draft.contact}
                  onChange={(e) => set("contact", e.target.value)}
                  placeholder="you@yourbusiness.com"
                />
              </label>
              <label className="field">
                Selected package
                <select
                  value={p.id}
                  onChange={(e) => set("packageId", e.target.value)}
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} · {money(p.price)} (sample)
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {step === 1 && (
            <>
              <label className="field">
                Promotion title *
                <input
                  required
                  value={draft.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Weekend coffee + pastry offer"
                />
              </label>
              <label className="field">
                What are you promoting? *
                <textarea
                  required
                  rows={4}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Tell us about your offer, product, or announcement…"
                />
              </label>
              <label className="field">
                Target audience
                <input
                  value={draft.audience}
                  onChange={(e) => set("audience", e.target.value)}
                  placeholder="Who would you like to reach?"
                />
              </label>
              <label className="field">
                Important text to include
                <textarea
                  rows={2}
                  value={draft.importantText}
                  onChange={(e) => set("importantText", e.target.value)}
                  placeholder="Offer details, dates, prices, or a call to action"
                />
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <label className="upload-zone">
                <Upload size={28} />
                <strong>Add your logo & photos</strong>
                <span>PNG, JPG, WEBP · up to 2 MB each · 6 files maximum</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => upload(e.target.files)}
                  aria-label="Upload logo and photos"
                />
              </label>
              <div className="sample-assets">
                <Button
                  type="button"
                  variant="outline"
                  disabled={draft.assets.some(
                    (a) => a.name === "Sample logo.svg",
                  )}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      assets: [
                        ...d.assets,
                        { name: "Sample logo.svg", url: "/favicon.svg" },
                      ].slice(0, 6),
                    }))
                  }
                >
                  <ImagePlus size={16} />
                  Use sample logo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={draft.assets.some(
                    (a) => a.name === "Sample coffee photo.jpg",
                  )}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      assets: [
                        ...d.assets,
                        {
                          name: "Sample coffee photo.jpg",
                          url: "/images/coffee.jpg",
                        },
                      ].slice(0, 6),
                    }))
                  }
                >
                  <FileImage size={16} />
                  Use sample photo
                </Button>
              </div>
              <div className="uploaded-assets">
                {draft.assets.map((a, i) => (
                  <div key={`${a.name}-${i}`}>
                    <img src={a.url} alt={a.name} />
                    <span>{a.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${a.name}`}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          assets: d.assets.filter((_, n) => n !== i),
                        }))
                      }
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="small muted">
                Assets are stored on this device for the prototype. You can also
                continue without uploads.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <label className="field">
                Brand colors
                <input
                  value={draft.colors}
                  onChange={(e) => set("colors", e.target.value)}
                  placeholder="e.g. Navy, warm yellow, and cream"
                />
              </label>
              <div className="brand-swatches">
                {["#213c59", "#f4c94e", "#f6f4ee", "#397b77"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Add brand color ${c}`}
                    style={{ background: c }}
                    onClick={() =>
                      set(
                        "colors",
                        `${draft.colors}${draft.colors ? ", " : ""}${c}`,
                      )
                    }
                  />
                ))}
              </div>
              <label className="field">
                Additional instructions
                <textarea
                  rows={5}
                  value={draft.instructions}
                  onChange={(e) => set("instructions", e.target.value)}
                  placeholder="Your preferred style, inspiration, or anything else we should know…"
                />
              </label>
            </>
          )}
          {step === 4 && (
            <div className="request-review">
              <div>
                <span>Business</span>
                <strong>{draft.business}</strong>
                <small>{draft.contact}</small>
              </div>
              <div>
                <span>Promotion</span>
                <strong>{draft.title}</strong>
                <p>{draft.description}</p>
              </div>
              <div>
                <span>Target audience</span>
                <p>{draft.audience || "Not specified"}</p>
              </div>
              <div>
                <span>Important text</span>
                <p>{draft.importantText || "No additional text"}</p>
              </div>
              <div>
                <span>Brand colors</span>
                <p>{draft.colors || "Creative team’s choice"}</p>
              </div>
              <div>
                <span>Instructions</span>
                <p>{draft.instructions || "Creative team’s choice"}</p>
              </div>
              <div>
                <span>Assets</span>
                <div className="review-assets">
                  {draft.assets.length ? (
                    draft.assets.map((a, i) => (
                      <img key={i} src={a.url} alt={a.name} />
                    ))
                  ) : (
                    <p>No assets added</p>
                  )}
                </div>
              </div>
              <PrototypeNotice>
                No payment is collected. This creates a local prototype request.
              </PrototypeNotice>
            </div>
          )}
          <div className="wizard-actions">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0 || submitting}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
            <Button disabled={!ready || submitting}>
              {submitting ? (
                <>
                  <LoaderCircle size={16} className="spin" />
                  Submitting…
                </>
              ) : step === 4 ? (
                "Submit request"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
        <aside className="request-summary">
          <span className="summary-icon">
            <SparkleIcon />
          </span>
          <span className="eyebrow">YOUR CREATIVE STARTING POINT</span>
          <h3>{p.title}</h3>
          <p>{p.deliverable}</p>
          <div className="summary-price">{money(p.price)}</div>
          <p className="pricing-note">
            Sample / test pricing
            <br />
            <strong>Prices are not final.</strong>
          </p>
          <hr />
          <div>
            <Check size={16} />
            <span>Personalized to your business</span>
          </div>
          <div>
            <Check size={16} />
            <span>Collaborate through Let’s Chat</span>
          </div>
          <div>
            <Check size={16} />
            <span>Track every step of your request</span>
          </div>
          <p className="small muted">
            Need something different?
            <br />
            <Link className="text-link" href="/create/">
              Explore all services
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
function SparkleIcon() {
  return <ImagePlus size={29} />;
}
