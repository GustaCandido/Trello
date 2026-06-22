"use client";

import type { ReactNode } from "react";
import { BoardProvider } from "@/lib/board-context";
import { Toaster } from "@/components/ui/sonner";

/** Provedores client-side da aplicação. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <BoardProvider>
      {children}
      <Toaster />
    </BoardProvider>
  );
}
