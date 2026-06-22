"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBoard } from "@/hooks/use-board";

/** Campo de busca que filtra tarefas por título e descrição. */
export function BoardSearch() {
  const { search, setSearch } = useBoard();

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar tarefas..."
        aria-label="Buscar tarefas"
        className="bg-background pl-9 text-foreground placeholder:text-muted-foreground"
      />
      {search && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => setSearch("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
