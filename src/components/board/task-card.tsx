"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { PriorityBadge } from "./priority-badge";

interface TaskCardProps {
  task: Task;
  columnId: string;
  onRemove?: (taskId: string) => void;
  /** Versão usada dentro do DragOverlay (sem sortable, levemente destacada). */
  overlay?: boolean;
  /** Desabilita o arraste (ex.: enquanto há busca ativa). */
  disabled?: boolean;
}

/** Conteúdo visual do card — compartilhado entre o card sortable e o overlay. */
function TaskCardContent({
  task,
  columnId,
  onRemove,
}: Pick<TaskCardProps, "task" | "columnId" | "onRemove">) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Excluir tarefa"
            className="size-6 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100 hover:text-destructive focus-visible:opacity-100"
            // Evita iniciar o drag ao clicar no botão de excluir.
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(task.id);
            }}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <p className="text-sm leading-snug font-medium wrap-break-word text-card-foreground">
        {task.title}
      </p>

      {task.description && (
        <p className="line-clamp-3 text-xs leading-relaxed wrap-break-word text-muted-foreground">
          {task.description}
        </p>
      )}

      {/* Coluna codificada nos dados de drag; mantida para acessibilidade futura. */}
      <span className="sr-only">Esteira: {columnId}</span>
    </>
  );
}

/** Card de tarefa arrastável (dnd-kit sortable). */
export function TaskCard({
  task,
  columnId,
  onRemove,
  overlay,
  disabled,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", taskId: task.id, columnId },
    disabled: overlay || disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Card
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      className={cn(
        "group/card flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-3 shadow-xs transition-shadow hover:shadow-md",
        !disabled && !overlay && "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-40",
        overlay && "rotate-3 cursor-grabbing shadow-lg",
      )}
    >
      <TaskCardContent task={task} columnId={columnId} onRemove={onRemove} />
    </Card>
  );
}
