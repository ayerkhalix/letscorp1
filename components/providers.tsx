"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Toaster, toast } from "sonner";
import { initialConversations, initialOrders } from "@/data/mock";
import type { Conversation, Order, RequestDraft, Role } from "@/types";
interface State {
  role: Role;
  setRole: (role: Role) => void;
  location: string;
  setLocation: (value: string) => void;
  saved: string[];
  savedPosts: string[];
  liked: string[];
  toggleSave: (id: string) => void;
  togglePost: (id: string) => void;
  toggleLike: (id: string) => void;
  conversations: Conversation[];
  openConversation: (id: string, name: string, initials: string) => void;
  sendMessage: (id: string, text: string, image?: string) => void;
  markRead: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, status: number, revision?: string) => void;
  draft: RequestDraft;
  setDraft: React.Dispatch<React.SetStateAction<RequestDraft>>;
}
const defaultDraft: RequestDraft = {
  packageId: "simple-graphic",
  business: "",
  contact: "",
  title: "",
  description: "",
  audience: "Local customers",
  importantText: "",
  colors: "#213c59, #f4c94e",
  instructions: "",
  assets: [],
};
const AppContext = createContext<State | null>(null);
export function Providers({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Customer");
  const [location, setLocation] = useState("Puerto Princesa");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [conversations, setConversations] = useState(initialConversations);
  const [orders, setOrders] = useState(initialOrders);
  const [draft, setDraft] = useState(defaultDraft);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("lets-corp-demo-v1");
      if (raw) {
        const s = JSON.parse(raw);
        setRole(s.role || "Customer");
        setLocation(s.location || "Puerto Princesa");
        setSaved(s.saved || []);
        setSavedPosts(s.savedPosts || []);
        setLiked(s.liked || []);
        setConversations(s.conversations || initialConversations);
        setOrders(s.orders || initialOrders);
        setDraft(s.draft || defaultDraft);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "lets-corp-demo-v1",
          JSON.stringify({
            role,
            location,
            saved,
            savedPosts,
            liked,
            conversations,
            orders,
            draft,
          }),
        );
      } catch {
        toast.error("Your device storage is full. This session still works.");
      }
  }, [
    ready,
    role,
    location,
    saved,
    savedPosts,
    liked,
    conversations,
    orders,
    draft,
  ]);
  function toggleSave(id: string) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function togglePost(id: string) {
    setSavedPosts((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }
  function toggleLike(id: string) {
    setLiked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function openConversation(id: string, name: string, initials: string) {
    setConversations((c) =>
      c.some((x) => x.id === id)
        ? c.map((x) => (x.id === id ? { ...x, unread: 0 } : x))
        : [
            ...c,
            {
              id,
              businessId: id,
              name,
              initials,
              type: "Businesses",
              unread: 0,
              messages: [
                {
                  id: crypto.randomUUID(),
                  text: `Hello! Welcome to ${name}. How can we help you today?`,
                  sent: false,
                  time: "Just now",
                },
              ],
            },
          ],
    );
  }
  function sendMessage(id: string, text: string, image?: string) {
    const time = new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Manila",
    }).format(new Date());
    setConversations((c) =>
      c.map((x) =>
        x.id === id
          ? {
              ...x,
              messages: [
                ...x.messages,
                { id: crypto.randomUUID(), text, sent: true, time, image },
              ],
            }
          : x,
      ),
    );
    setTimeout(
      () =>
        setConversations((c) =>
          c.map((x) =>
            x.id === id
              ? {
                  ...x,
                  messages: [
                    ...x.messages,
                    {
                      id: crypto.randomUUID(),
                      text: "Thanks for your message! This is a demo reply. Our team would be happy to help with your request.",
                      sent: false,
                      time,
                    },
                  ],
                }
              : x,
          ),
        ),
      1400,
    );
  }
  function markRead(id: string) {
    setConversations((c) =>
      c.map((x) => (x.id === id ? { ...x, unread: 0 } : x)),
    );
  }
  function addOrder(order: Order) {
    setOrders((o) => [order, ...o]);
  }
  function updateOrder(id: string, status: number, revision?: string) {
    setOrders((o) =>
      o.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              revisions: revision ? [...x.revisions, revision] : x.revisions,
            }
          : x,
      ),
    );
  }
  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        location,
        setLocation,
        saved,
        savedPosts,
        liked,
        toggleSave,
        togglePost,
        toggleLike,
        conversations,
        openConversation,
        sendMessage,
        markRead,
        orders,
        addOrder,
        updateOrder,
        draft,
        setDraft,
      }}
    >
      {children}
      <Toaster position="top-center" richColors />
    </AppContext.Provider>
  );
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp requires Providers");
  return value;
}
