import { LayoutDashboard } from "lucide-react";
import { BoardSearch } from "@/components/board/board-search";

/** Barra superior do app: marca + busca. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-primary text-primary-foreground shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <LayoutDashboard className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Quadro</span>
        </div>

        <div className="order-3 w-full sm:order-0 sm:ml-auto sm:w-auto">
          <BoardSearch />
        </div>
      </div>
    </header>
  );
}
