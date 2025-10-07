"use client";

import { usePathname } from "next/navigation";
import ChatLauncher from "@/components/ChatLauncher";

export default function GlobalChatLauncher() {
  const pathname = usePathname();
  const hide =
    pathname === "/dashboard/chatbot" ||
    pathname === "/" ||
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up");

  if (hide) {
    return null;
  }

  return <ChatLauncher />;
}
