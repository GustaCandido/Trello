"use client";

import { useContext } from "react";
import { BoardContext, type BoardContextValue } from "@/lib/board-context";

/** Acessa o estado e as ações do quadro. Deve ser usado dentro de <BoardProvider>. */
export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoard deve ser usado dentro de <BoardProvider>.");
  }
  return ctx;
}
