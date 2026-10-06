"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Send,
  Paperclip,
  ImagePlus,
  MapPin,
  BadgeCheck,
  CheckCheck,
  MessageCircle,
  Store,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/components/providers";
import { businesses, businessById } from "@/data/mock";
import { PageTitle, SearchInput, Chips } from "@/components/ui/shared";
import { EmptyState } from "@/components/ui/states";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function ChatScreen({ conversationId }: { conversationId?: string }) {
  const { conversations, openConversation, sendMessage, markRead, role } =
    useApp();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [newOpen, setNewOpen] = useState(false);
  const [contactType, setContactType] = useState("Businesses");
  const [contactSearch, setContactSearch] = useState("");
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const attachmentFile = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const selected = conversationId || conversations[0]?.id;
  const thread = conversations.find((c) => c.id === selected);
  const b = thread?.businessId ? businessById(thread.businessId) : null;
  useEffect(() => {
    if (conversationId) {
      const business = businessById(conversationId);
      if (business)
        openConversation(business.id, business.name, business.initials);
      markRead(conversationId);
    }
    setText("");
    setAttachment(null);
  }, [conversationId]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [thread?.messages.length, selected]);
  const filtered = conversations.filter(
    (c) =>
      (filter === "All" || c.type === filter) &&
      `${c.name} ${c.messages.at(-1)?.text || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function start(id: string, name: string, initials: string) {
    openConversation(id, name, initials);
    setNewOpen(false);
    router.push(`/chat/${id}/`);
  }
  function send() {
    if (!selected || (!text.trim() && !attachment)) return;
    sendMessage(
      selected,
      text.trim() || (attachment ? `Shared ${attachment.name}` : ""),
      attachment?.url,
    );
    setText("");
    setAttachment(null);
  }
  function upload(f: File | undefined) {
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      toast.error("Choose an image under 2 MB for this demo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setAttachment({ name: f.name, url: String(reader.result) });
    reader.readAsDataURL(f);
  }
  return (
    <div className={`chat-screen ${conversationId ? "conversation-open" : ""}`}>
      <PageTitle
        title="Let’s Chat"
        description="Good connections start with a conversation."
      >
        <Button onClick={() => setNewOpen(true)}>
          <Plus size={17} />
          New message
        </Button>
      </PageTitle>
      <div className="chat-layout">
        <aside className="conversation-sidebar">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search conversations..."
          />
          <Chips
            options={["All", "Businesses", "Customers"]}
            value={filter}
            onChange={setFilter}
          />
          <div className="conversation-list">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/chat/${c.id}/`}
                className={`conversation-item ${selected === c.id ? "active" : ""}`}
              >
                <span
                  className="avatar"
                  style={{
                    background: c.businessId
                      ? businessById(c.businessId)?.color
                      : undefined,
                  }}
                >
                  {c.initials}
                </span>
                <div>
                  <strong>{c.name}</strong>
                  <p>
                    {c.messages.at(-1)?.sent ? "You: " : ""}
                    {c.messages.at(-1)?.text || "Start a conversation"}
                  </p>
                  <small>
                    {c.type === "Businesses" ? "Business" : "Customer"} ·{" "}
                    {c.messages.at(-1)?.time}
                  </small>
                </div>
                {c.unread > 0 && (
                  <span className="unread-count">{c.unread}</span>
                )}
              </Link>
            ))}
            {!filtered.length && (
              <EmptyState
                title="No conversations found"
                description="Try another search, or start a new message."
              />
            )}
          </div>
          <div className="chat-sidebar-note">
            <MessageCircle size={20} />
            <p>A place for customers and businesses to meet.</p>
          </div>
        </aside>
        <section className="chat-thread">
          {thread ? (
            <>
              <header className="thread-header">
                <Link
                  className="mobile-chat-back icon-button"
                  href="/chat/"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </Link>
                <span className="avatar" style={{ background: b?.color }}>
                  {thread.initials}
                </span>
                <div>
                  <Link href={b ? `/business/${b.id}/` : "/create/"}>
                    <h3>
                      {thread.name}
                      {thread.type === "Businesses" && <BadgeCheck size={15} />}
                    </h3>
                  </Link>
                  <p>
                    <span className="online-dot" />
                    Typically replies in a few minutes · demo
                  </p>
                </div>
                {b && (
                  <Link
                    className="icon-button"
                    aria-label="View business on map"
                    href={`/${b.kind === "travel" ? "travel" : "work"}/?view=map&focus=${b.id}`}
                  >
                    <MapPin size={20} />
                  </Link>
                )}
              </header>
              <div className="chat-messages">
                <div className="chat-date">Your local conversation</div>
                <div className="chat-context">
                  <BadgeCheck size={14} />
                  {thread.type === "Businesses"
                    ? "You’re connected with a local business."
                    : "A conversation with your customer."}
                </div>
                {thread.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message-row ${m.sent ? "sent" : "received"}`}
                  >
                    <div className="message-bubble">
                      {m.image && <img src={m.image} alt="Shared photo" />}
                      <p>{m.text}</p>
                      <span>
                        {m.time}
                        {m.sent && <CheckCheck size={13} />}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottom} />
              </div>
              {attachment && (
                <div className="chat-attachment-preview">
                  <img src={attachment.url} alt="Image to send" />
                  <span>{attachment.name}</span>
                  <button
                    aria-label="Remove attachment"
                    onClick={() => setAttachment(null)}
                  >
                    <X size={17} />
                  </button>
                </div>
              )}
              <form
                className="chat-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Add attachment"
                  onClick={() => attachmentFile.current?.click()}
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Add photo"
                  onClick={() => file.current?.click()}
                >
                  <ImagePlus size={20} />
                </button>
                <input
                  aria-label="Message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a little hello…"
                />
                <Button
                  aria-label="Send message"
                  disabled={!text.trim() && !attachment}
                >
                  <Send size={19} />
                </Button>
                <input
                  ref={file}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => upload(e.target.files?.[0])}
                />
                <input
                  ref={attachmentFile}
                  type="file"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.type.startsWith("image/")) upload(f);
                      else {
                        setText(
                          (t) => `${t}${t ? " " : ""}[Attachment: ${f.name}]`,
                        );
                        toast.info(
                          "File attachment represented as a message in this prototype.",
                        );
                      }
                    }
                  }}
                />
              </form>
              <div className="chat-demo-note">
                Prototype messaging · messages stay on this device
              </div>
            </>
          ) : (
            <EmptyState
              title="Say hello to local"
              description="Choose a conversation or start a new one."
            />
          )}
        </section>
      </div>
      <Dialog
        open={newOpen}
        onOpenChange={setNewOpen}
        title="Start a local conversation"
        description={`${role} account · connect with a business or customer.`}
      >
        <Chips
          options={["Businesses", "Customers"]}
          value={contactType}
          onChange={setContactType}
        />
        <SearchInput
          value={contactSearch}
          onChange={setContactSearch}
          placeholder="Search contacts..."
        />
        <div className="new-contacts">
          {contactType === "Businesses" ? (
            businesses
              .filter((b) =>
                b.name.toLowerCase().includes(contactSearch.toLowerCase()),
              )
              .map((b) => (
                <button
                  key={b.id}
                  onClick={() => start(b.id, b.name, b.initials)}
                >
                  <span className="avatar" style={{ background: b.color }}>
                    {b.initials}
                  </span>
                  <span>
                    <strong>{b.name}</strong>
                    <small>
                      {b.category} · {b.address.split(",")[0]}
                    </small>
                  </span>
                  <Store size={17} />
                </button>
              ))
          ) : (
            <button
              onClick={() => {
                setNewOpen(false);
                router.push("/chat/customer-mika/");
              }}
            >
              <span className="avatar">MS</span>
              <span>
                <strong>Mika Santos</strong>
                <small>Customer · Recent enquiry</small>
              </span>
              <User size={17} />
            </button>
          )}
        </div>
      </Dialog>
    </div>
  );
}
