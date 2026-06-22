export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
}

/** Uma "esteira" (coluna) do quadro. */
export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface BoardState {
  columns: Column[];
}

/** Metadados de cada prioridade: rótulo em pt-BR e classes de cor do badge. */
export const PRIORITY_META: Record<
  Priority,
  { label: string; badgeClass: string }
> = {
  low: {
    label: "Baixa",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  medium: {
    label: "Média",
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  high: {
    label: "Alta",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export const PRIORITY_ORDER: Priority[] = ["low", "medium", "high"];
