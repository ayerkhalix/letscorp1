"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  BadgeCheck,
  MapPin,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import type { Post } from "@/types";
import { businessById } from "@/data/mock";
import { useApp } from "@/components/providers";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function PostCard({ post: p }: { post: Post }) {
  const b = businessById(p.businessId)!;
  const { liked, savedPosts, toggleLike, togglePost, openConversation } =
    useApp();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([
    "Love seeing local businesses here!",
  ]);
  return (
    <article className="feed-post">
      <div className="post-header">
        <Link href={`/business/${b.id}/`} className="business-identity">
          <span className="avatar" style={{ background: b.color }}>
            {b.initials}
          </span>
          <div>
            <strong>
              {b.name}
              <BadgeCheck size={15} />
            </strong>
            <small>
              {p.sponsored ? "Sponsored · " : ""}
              {p.time}
            </small>
          </div>
        </Link>
        <button
          className={`post-save ${savedPosts.includes(p.id) ? "saved" : ""}`}
          aria-label={`${savedPosts.includes(p.id) ? "Unsave" : "Save"} post`}
          onClick={() => togglePost(p.id)}
        >
          <Bookmark
            size={19}
            fill={savedPosts.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <Link href={`/see/${p.id}/`} className="post-media">
        <img src={p.image} alt={p.title} loading="lazy" />
        <span className="post-promo-badge">{p.badge}</span>
        <div>
          <small>{b.name.toUpperCase()}</small>
          <h2>{p.title}</h2>
        </div>
      </Link>
      <div className="post-body">
        <Link className="post-location" href={`/work/?view=map&focus=${b.id}`}>
          <MapPin size={13} />
          {b.address}
        </Link>
        <p>{p.caption}</p>
        <div className="post-business-cta">
          <span>Discover a little more local.</span>
          <Link className="btn btn-outline" href={`/business/${b.id}/`}>
            View business
          </Link>
        </div>
      </div>
      <div className="post-actions">
        <button
          aria-pressed={liked.includes(p.id)}
          className={liked.includes(p.id) ? "liked" : ""}
          onClick={() => toggleLike(p.id)}
        >
          <Heart
            size={20}
            fill={liked.includes(p.id) ? "currentColor" : "none"}
          />
          {p.likes + (liked.includes(p.id) ? 1 : 0)}
        </button>
        <button onClick={() => setCommentsOpen(true)}>
          <MessageCircle size={20} />
          {comments.length}
          <span>Comment</span>
        </button>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${window.location.origin}/see/${p.id}/`,
              );
              toast.success("Promotion link copied.");
            } catch {
              toast.info("Share this promotion using the page URL.");
            }
          }}
        >
          <Share2 size={19} />
          <span>Share</span>
        </button>
      </div>
      <Dialog
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        title="A little local conversation"
        description="Comments are part of this demo session."
      >
        <div className="comments-list">
          {comments.map((c, i) => (
            <div key={i}>
              <span className="avatar small-avatar">
                {i === 0 ? "JL" : "AS"}
              </span>
              <p>
                <strong>{i === 0 ? "Jules Lim" : "Alex Santos"}</strong>
                {c}
              </p>
            </div>
          ))}
        </div>
        <form
          className="comment-composer"
          onSubmit={(e) => {
            e.preventDefault();
            if (comment.trim()) {
              setComments((s) => [...s, comment.trim()]);
              setComment("");
            }
          }}
        >
          <input
            aria-label="Write a comment"
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button aria-label="Post comment" disabled={!comment.trim()}>
            <Send size={17} />
          </Button>
        </form>
      </Dialog>
    </article>
  );
}
