"use client";

import { usePathname } from "next/navigation";
import ChatLauncher from "@/components/ChatLauncher";

export default function GlobalChatLauncher() {
  const pathname = usePathname();
  const hide = pathname === "/dashboard/chatbot";
  if (hide) return null;
  return <ChatLauncher />;
}