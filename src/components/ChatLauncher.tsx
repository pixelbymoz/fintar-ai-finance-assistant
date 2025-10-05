"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Chat from "@/components/Chat";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [animateIn, setAnimateIn] = useState(false);

  const closeSheet = () => {
    // trigger slide-out then unmount
    setAnimateIn(false);
    setTimeout(() => setOpen(false), 300);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Animate in when opened
  useEffect(() => {
    if (open) {
      // start with off-screen, then slide in next frame
      setAnimateIn(false);
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  return (
    <>
      {/* Floating Action Button */}
      <Button
        variant="default"
        className="fixed bottom-6 right-6 z-50 shadow-lg gap-2"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">Chat dengan Fintar</span>
      </Button>

      {/* Sheet / Fullscreen */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeSheet}
          />

          {/* Panel */}
          <aside
            className={
              isMobile
                ? `absolute inset-0 bg-background transition-transform duration-300 ${animateIn ? 'translate-y-0' : 'translate-y-full'}`
                : `absolute right-0 top-0 h-full w-[520px] xl:w-[600px] 2xl:w-[680px] bg-background border-l shadow-xl transition-transform duration-300 ${animateIn ? 'translate-x-0' : 'translate-x-full'}`
            }
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-accent/40">
              <div className="font-medium">Fintar AI Assistant</div>
              <Button variant="ghost" size="icon" onClick={closeSheet} aria-label="Tutup">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-3rem)]">
              <Chat />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}