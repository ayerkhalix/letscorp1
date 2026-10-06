"use client";
import { PhotoCredits } from "@/components/photo-credits";
import { DirectoryScreen } from "./directory";
import { FeedScreen } from "./feed";
import { BusinessDetail } from "./business-detail";
import { ChatScreen } from "./chat";
import { CreateScreen } from "./create";
import { RequestScreen } from "./request";
import { OrdersScreen } from "./orders";
import { AIWorkspace } from "./ai-workspace";
import {
  ProfileScreen,
  NotificationsScreen,
  SettingsScreen,
  HelpScreen,
} from "./account";
import {
  SubscriptionScreen,
  AdvertisingScreen,
  AdminScreen,
} from "./business-tools";
export function RouteScreen({ path }: { path: string[] }) {
  switch (path[0]) {
    case "work":
    case "travel":
    case "eat":
      return <DirectoryScreen type={path[0]} />;
    case "see":
      return <FeedScreen postId={path[1]} />;
    case "business":
      return <BusinessDetail id={path[1]} />;
    case "chat":
      return <ChatScreen conversationId={path[1]} />;
    case "create":
      return path[1] === "request" ? (
        <RequestScreen />
      ) : path[1] === "orders" ? (
        <OrdersScreen />
      ) : path[1] === "order" ? (
        <OrdersScreen detail />
      ) : path[1] === "ai" ? (
        <AIWorkspace />
      ) : (
        <CreateScreen />
      );
    case "profile":
      return <ProfileScreen />;
    case "notifications":
      return <NotificationsScreen />;
    case "settings":
      return <SettingsScreen />;
    case "help":
      return <HelpScreen />;
    case "subscriptions":
      return <SubscriptionScreen />;
    case "advertise":
      return <AdvertisingScreen />;
    case "admin":
      return <AdminScreen />;
    case "credits":
      return <PhotoCredits />;
    default:
      return null;
  }
}
