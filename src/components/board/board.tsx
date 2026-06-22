"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBoard } from "@/hooks/use-board";
import type { Task } from "@/lib/types";
import { BoardColumn } from "./board-column";
import { AddColumn } from "./add-column";
import { TaskCard } from "./task-card";

/** Verifica se uma tarefa corresponde ao termo de busca (título + descrição). */
function matchesSearch(task: Task, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    task.title.toLowerCase().includes(q) ||
    (task.description?.toLowerCase().includes(q) ?? false)
  );
}

export function Board() {
  const { state, hydrated, search, removeColumn, removeTask, moveTask } =
    useBoard();
  const [activeTask, setActiveTask] = useState<{
    task: Task;
    columnId: string;
  } | null>(null);

  const query = search.trim();
  const isSearching = query.length > 0;
  const dragDisabled = isSearching;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Pequena distância evita iniciar o drag em cliques (botões, menu).
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Tarefas filtradas por coluna (memoizado para performance).
  const filteredByColumn = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const col of state.columns) {
      map[col.id] = col.tasks.filter((t) => matchesSearch(t, query));
    }
    return map;
  }, [state.columns, query]);

  // Durante a busca, exibe apenas as esteiras com pelo menos uma correspondência.
  const visibleColumns = isSearching
    ? state.columns.filter((col) => (filteredByColumn[col.id]?.length ?? 0) > 0)
    : state.columns;

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type !== "task") return;
    const col = state.columns.find((c) => c.id === data.columnId);
    const task = col?.tasks.find((t) => t.id === data.taskId);
    if (col && task) setActiveTask({ task, columnId: col.id });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeData = active.data.current;
    if (activeData?.type !== "task") return;

    const taskId = active.id as string;
    const fromColumnId = activeData.columnId as string;

    const overData = over.data.current;
    const toColumnId =
      overData?.type === "column"
        ? (overData.columnId as string)
        : overData?.type === "task"
          ? (overData.columnId as string)
          : null;
    if (!toColumnId) return;

    const targetCol = state.columns.find((c) => c.id === toColumnId);
    if (!targetCol) return;

    // Posição alvo calculada na lista de destino SEM a tarefa arrastada.
    const without = targetCol.tasks.filter((t) => t.id !== taskId);
    let toIndex: number;
    if (overData?.type === "task") {
      const idx = without.findIndex((t) => t.id === over.id);
      toIndex = idx === -1 ? without.length : idx;
    } else {
      toIndex = without.length; // soltou na área da coluna → fim
    }

    // Evita despachar quando nada muda.
    const fromCol = state.columns.find((c) => c.id === fromColumnId);
    const oldIndex = fromCol?.tasks.findIndex((t) => t.id === taskId) ?? -1;
    if (fromColumnId === toColumnId && oldIndex === toIndex) return;

    moveTask({ taskId, fromColumnId, toColumnId, toIndex });
  }

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Carregando seu quadro...
      </div>
    );
  }

  if (state.columns.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Seu quadro está vazio
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Crie sua primeira esteira para começar a organizar suas tarefas.
          </p>
        </div>
        <div className="flex justify-center">
          <AddColumn />
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex h-full items-start gap-4 overflow-x-auto px-4 pb-4 sm:px-6">
        {visibleColumns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={filteredByColumn[column.id] ?? []}
            onRemoveColumn={removeColumn}
            onRemoveTask={removeTask}
            dragDisabled={dragDisabled}
          />
        ))}

        {!isSearching && <AddColumn />}

        {isSearching && visibleColumns.length === 0 && (
          <p className="m-auto max-w-xs text-center text-sm text-muted-foreground">
            Nenhuma tarefa encontrada para “{query}”.
          </p>
        )}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <TaskCard
            task={activeTask.task}
            columnId={activeTask.columnId}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
