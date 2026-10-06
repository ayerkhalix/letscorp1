"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Bookmark,
  Globe,
  Phone,
  Camera,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { businessById, businesses, posts, money } from "@/data/mock";
import { useApp } from "@/components/providers";
import { AppMap } from "@/components/maps/app-map";
import { PostCard } from "@/components/feed/post-card";
import { BusinessCard } from "@/components/business/business-card";
import {
  BackLink,
  SectionTitle,
  PrototypeNotice,
} from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
export function BusinessDetail({ id }: { id: string }) {
  const b = businessById(id)!;
  const { saved, toggleSave, openConversation } = useApp();
  const router = useRouter();
  const [contact, setContact] = useState(false);
  const [gallery, setGallery] = useState<string | null>(null);
  const [tab, setTab] = useState("about");
  const relatedPosts = posts.filter((p) => p.businessId === b.id);
  const similar = businesses
    .filter(
      (x) => x.id !== id && (x.category === b.category || x.kind === b.kind),
    )
    .slice(0, 3);
  function message() {
    openConversation(b.id, b.name, b.initials);
    router.push(`/chat/${b.id}/`);
  }
  return (
    <div className="business-detail">
      <BackLink
        href={b.kind === "travel" ? "/travel/" : "/work/"}
        label={
          b.kind === "travel" ? "Back to Let’s Travel" : "Back to Let’s Work"
        }
      />
      <div className="business-cover">
        <img src={b.image} alt={b.name} />
        <span className="image-badge">
          <BadgeCheck size={14} />
          Verified local business
        </span>
        <button className="cover-gallery" onClick={() => setGallery(b.image)}>
          <Camera size={16} />
          View photos
        </button>
      </div>
      <div className="business-profile-heading">
        <span className="business-logo" style={{ background: b.color }}>
          {b.initials}
        </span>
        <div>
          <span className="eyebrow">
            {b.category} · {b.subscriptionTier} listing
          </span>
          <h1>
            {b.name}
            <BadgeCheck size={22} />
          </h1>
          <p>
            <Star size={16} fill="currentColor" className="star" />
            <strong>{b.rating}</strong> ({b.reviewCount} reviews)<span>·</span>
            <MapPin size={15} />
            {b.address}
          </p>
        </div>
        <button
          className={`btn btn-outline ${saved.includes(id) ? "saved" : ""}`}
          onClick={() => toggleSave(id)}
        >
          <Bookmark
            size={17}
            fill={saved.includes(id) ? "currentColor" : "none"}
          />
          {saved.includes(id) ? "Saved" : "Save place"}
        </button>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="detail-tabs">
              <TabsTrigger value="about">Overview</TabsTrigger>
              <TabsTrigger value="services">
                {b.kind === "travel" ? "Experiences" : "Services & products"}
              </TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="promotions">
                Promotions
                {relatedPosts.length > 0 && <span>{relatedPosts.length}</span>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <div className="detail-section">
                <h2>A little about us</h2>
                <p className="description-large">{b.description}</p>
                <div className="amenity-tags">
                  {b.tags.map((t) => (
                    <span key={t}>
                      <Check size={15} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <SectionTitle title="Right around here" />
                <AppMap items={[b]} focus={b.id} compact />
                <p className="detail-map-address">
                  <MapPin size={17} />
                  {b.address}
                  <Link
                    href={`/${b.kind === "travel" ? "travel" : "work"}/?view=map&focus=${b.id}`}
                  >
                    Explore full map
                  </Link>
                </p>
              </div>
              {relatedPosts.length > 0 && (
                <div className="detail-section">
                  <SectionTitle title="What’s new with us" />
                  <PostCard post={relatedPosts[0]} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="services">
              <div className="detail-section">
                <h2>
                  {b.kind === "travel"
                    ? "Make the most of your stay"
                    : "Made for your everyday"}
                </h2>
                <div className="service-list">
                  {b.services.map((s, i) => (
                    <div key={s}>
                      <span className="service-number">0{i + 1}</span>
                      <div>
                        <h3>{s}</h3>
                        <p>Message our team for details and availability.</p>
                      </div>
                      <button className="btn btn-outline" onClick={message}>
                        Enquire
                      </button>
                    </div>
                  ))}
                </div>
                <PrototypeNotice>
                  Menu and experience prices are illustrative. Contact this demo
                  business for the prototype conversation.
                </PrototypeNotice>
              </div>
            </TabsContent>
            <TabsContent value="photos">
              <div className="detail-section">
                <h2>A closer look</h2>
                <div className="photo-gallery">
                  {[b.image, ...b.gallery]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((src, i) => (
                      <button
                        key={src}
                        aria-label={`Open photo ${i + 1} of ${b.name}`}
                        onClick={() => setGallery(src)}
                      >
                        <img src={src} alt={`${b.name} — photo ${i + 1}`} />
                      </button>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="promotions">
              <div className="detail-section">
                <h2>Fresh from our business</h2>
                {relatedPosts.length ? (
                  relatedPosts.map((p) => <PostCard key={p.id} post={p} />)
                ) : (
                  <div className="empty-state">
                    <h3>Good things are on their way.</h3>
                    <p>Save this business and come back for local updates.</p>
                    <Button
                      onClick={() => {
                        if (!saved.includes(id)) toggleSave(id);
                        toast.success("Business saved.");
                      }}
                    >
                      Save this business
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <aside className="business-contact-card">
          <span className={`badge ${b.open ? "green" : "subtle"}`}>
            {b.open ? "Open now" : "Closed now"}
          </span>
          <h3>Let’s connect.</h3>
          <p>Real conversations start with a simple hello.</p>
          {b.price && (
            <div className="detail-price">
              <small>Starting from</small>
              <strong>
                {money(b.price)}
                <span>
                  {" "}
                  /{" "}
                  {["Hotels", "Resorts"].includes(b.category)
                    ? "night"
                    : "person"}
                </span>
              </strong>
              <small>Sample rate · confirm with provider</small>
            </div>
          )}
          <Button className="full-width" onClick={message}>
            <MessageCircle size={18} />
            Message Business
          </Button>
          <Link
            className="btn btn-outline full-width"
            href={`/${b.kind === "travel" ? "travel" : "work"}/?view=map&focus=${b.id}`}
          >
            <MapPin size={17} />
            View on Map
          </Link>
          <div className="contact-details">
            <p>
              <Clock size={18} />
              <span>
                <strong>Opening hours</strong>
                {b.hours}
              </span>
            </p>
            <p>
              <MapPin size={18} />
              <span>
                <strong>Location</strong>
                {b.address}
                <small>{b.distance} from demo location</small>
              </span>
            </p>
          </div>
          <div className="contact-links">
            <button onClick={() => setContact(true)}>
              <Phone size={16} />
              Contact
            </button>
            <button onClick={() => setContact(true)}>
              <Globe size={16} />
              Website
            </button>
            <button onClick={() => setContact(true)}>
              <ExternalLink size={16} />
              Social
            </button>
          </div>
          <span className="verified-footnote">
            <BadgeCheck size={15} />
            Part of the Let’s Corp community
          </span>
        </aside>
      </div>
      <section>
        <SectionTitle
          title={
            b.kind === "travel"
              ? "A few more island possibilities"
              : "More places you might love"
          }
          href={b.kind === "travel" ? "/travel/" : "/work/"}
          action="Keep exploring"
        />
        <div className="business-grid">
          {similar.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </section>
      <Dialog
        open={contact}
        onOpenChange={setContact}
        title={`Connect with ${b.name}`}
        description="This listing represents a fictional business in our local prototype."
      >
        <p className="description-large">
          Message the business to try an enquiry, ask about services, or explore
          how Let’s Corp brings people together.
        </p>
        <Button className="full-width" onClick={message}>
          <MessageCircle size={17} />
          Start a conversation
        </Button>
      </Dialog>
      <Dialog
        open={!!gallery}
        onOpenChange={() => setGallery(null)}
        title={b.name}
        description="Business photo gallery."
      >
        {gallery && (
          <img className="gallery-lightbox" src={gallery} alt={b.name} />
        )}
      </Dialog>
    </div>
  );
}
