export type Service = "eat" | "work" | "see" | "travel" | "chat" | "create";
export type Role = "Customer" | "Business" | "Admin";
export interface Business {
  id: string;
  name: string;
  category: string;
  kind: "business" | "restaurant" | "travel";
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  initials: string;
  hours: string;
  open: boolean;
  distance: string;
  tags: string[];
  featured: boolean;
  subscriptionTier: string;
  services: string[];
  price?: number;
  color: string;
}
export interface Post {
  id: string;
  businessId: string;
  type: string;
  title: string;
  caption: string;
  image: string;
  time: string;
  likes: number;
  sponsored?: boolean;
  badge: string;
}
export interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  image?: string;
}
export interface Conversation {
  id: string;
  businessId?: string;
  name: string;
  initials: string;
  type: "Businesses" | "Customers";
  unread: number;
  messages: Message[];
}
export interface Package {
  id: string;
  title: string;
  group: "STILL" | "REELS" | "BUNDLES";
  deliverable: string;
  useCase: string;
  price: number;
}
export interface RequestDraft {
  packageId: string;
  business: string;
  contact: string;
  title: string;
  description: string;
  audience: string;
  importantText: string;
  colors: string;
  instructions: string;
  assets: { name: string; url: string }[];
}
export interface Order {
  id: string;
  packageId: string;
  business: string;
  title: string;
  price: number;
  submitted: string;
  status: number;
  instructions: string;
  assets: { name: string; url: string }[];
  revisions: string[];
}
