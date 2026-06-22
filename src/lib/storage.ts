import type { BoardState } from "./types";

const STORAGE_KEY = "trello:board";

const EMPTY_BOARD: BoardState = { columns: [] };

/** Gera um id único (com fallback caso crypto.randomUUID não exista). */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Carrega o quadro do localStorage. SSR-safe: retorna board vazio no servidor. */
export function loadBoard(): BoardState {
  if (typeof window === "undefined") return EMPTY_BOARD;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_BOARD;
    const parsed = JSON.parse(raw) as BoardState;
    if (!parsed || !Array.isArray(parsed.columns)) return EMPTY_BOARD;
    return parsed;
  } catch {
    return EMPTY_BOARD;
  }
}

/** Persiste o quadro no localStorage. */
export function saveBoard(state: BoardState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignora quotas excedidas / modo privado.
  }
}
