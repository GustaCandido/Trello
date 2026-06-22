"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Column, Task } from "@/lib/types";
import { TaskCard } from "./task-card";
import { CreateTaskDialog } from "./create-task-dialog";

interface BoardColumnProps {
  column: Column;
  /** Tarefas já filtradas pela busca (pode ser menor que column.tasks). */
  tasks: Task[];
  onRemoveColumn: (columnId: string) => void;
  onRemoveTask: (columnId: string, taskId: string) => void;
  /** Desabilita o arraste das tarefas (ex.: durante a busca). */
  dragDisabled?: boolean;
}

/** Uma esteira (coluna) do quadro. */
export function BoardColumn({
  column,
  tasks,
  onRemoveColumn,
  onRemoveTask,
  dragDisabled,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <section className="flex max-h-full w-72 shrink-0 flex-col rounded-2xl bg-muted/60 ring-1 ring-border/50">
      {/* Cabeçalho da esteira */}
      <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {column.title}
          </h2>
          <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {column.tasks.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label="Opções da esteira"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRemoveColumn(column.id)}
            >
              <Trash2 className="size-4" />
              Excluir esteira
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Lista de tarefas (área droppable) */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-2 flex-1 flex-col gap-2 overflow-y-auto px-3 py-1 transition-colors",
          isOver && "bg-accent/40",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              onRemove={(taskId) => onRemoveTask(column.id, taskId)}
              disabled={dragDisabled}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className="rounded-lg border border-dashed border-border/70 px-3 py-6 text-center text-xs text-muted-foreground">
            {column.tasks.length === 0
              ? "Nenhuma tarefa ainda"
              : "Nenhuma tarefa corresponde à busca"}
          </p>
        )}
      </div>

      {/* Adicionar tarefa */}
      <div className="p-2">
        <CreateTaskDialog columnId={column.id}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" />
            Adicionar tarefa
          </Button>
        </CreateTaskDialog>
      </div>
    </section>
  );
}
