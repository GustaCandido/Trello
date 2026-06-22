"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { BoardState, Priority, Task } from "./types";
import { createId, loadBoard, saveBoard } from "./storage";

interface NewTaskInput {
  title: string;
  description?: string;
  priority: Priority;
}

interface MoveTaskInput {
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
  /** Índice de destino dentro da coluna alvo. */
  toIndex: number;
}

type Action =
  | { type: "HYDRATE"; state: BoardState }
  | { type: "ADD_COLUMN"; title: string }
  | { type: "REMOVE_COLUMN"; columnId: string }
  | { type: "RENAME_COLUMN"; columnId: string; title: string }
  | { type: "ADD_TASK"; columnId: string; task: NewTaskInput }
  | { type: "REMOVE_TASK"; columnId: string; taskId: string }
  | { type: "MOVE_TASK"; payload: MoveTaskInput };

function reducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD_COLUMN":
      return {
        columns: [
          ...state.columns,
          { id: createId(), title: action.title.trim(), tasks: [] },
        ],
      };

    case "REMOVE_COLUMN":
      return {
        columns: state.columns.filter((c) => c.id !== action.columnId),
      };

    case "RENAME_COLUMN":
      return {
        columns: state.columns.map((c) =>
          c.id === action.columnId ? { ...c, title: action.title.trim() } : c,
        ),
      };

    case "ADD_TASK": {
      const task: Task = {
        id: createId(),
        title: action.task.title.trim(),
        description: action.task.description?.trim() || undefined,
        priority: action.task.priority,
      };
      return {
        columns: state.columns.map((c) =>
          c.id === action.columnId ? { ...c, tasks: [...c.tasks, task] } : c,
        ),
      };
    }

    case "REMOVE_TASK":
      return {
        columns: state.columns.map((c) =>
          c.id === action.columnId
            ? { ...c, tasks: c.tasks.filter((t) => t.id !== action.taskId) }
            : c,
        ),
      };

    case "MOVE_TASK": {
      const { taskId, fromColumnId, toColumnId, toIndex } = action.payload;
      const from = state.columns.find((c) => c.id === fromColumnId);
      const task = from?.tasks.find((t) => t.id === taskId);
      if (!from || !task) return state;

      return {
        columns: state.columns.map((c) => {
          // Remove da coluna de origem.
          if (c.id === fromColumnId && fromColumnId !== toColumnId) {
            return { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) };
          }
          // Insere/reordena na coluna de destino.
          if (c.id === toColumnId) {
            const withoutTask = c.tasks.filter((t) => t.id !== taskId);
            const index = Math.max(0, Math.min(toIndex, withoutTask.length));
            const next = [...withoutTask];
            next.splice(index, 0, task);
            return { ...c, tasks: next };
          }
          return c;
        }),
      };
    }

    default:
      return state;
  }
}

export interface BoardContextValue {
  state: BoardState;
  /** Indica que a hidratação do localStorage já ocorreu (evita flash no SSR). */
  hydrated: boolean;
  search: string;
  setSearch: (value: string) => void;
  addColumn: (title: string) => void;
  removeColumn: (columnId: string) => void;
  renameColumn: (columnId: string, title: string) => void;
  addTask: (columnId: string, task: NewTaskInput) => void;
  removeTask: (columnId: string, taskId: string) => void;
  moveTask: (payload: MoveTaskInput) => void;
}

export const BoardContext = createContext<BoardContextValue | null>(null);

const INITIAL_STATE: BoardState = { columns: [] };

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");

  // Hidrata a partir do localStorage somente no cliente.
  useEffect(() => {
    dispatch({ type: "HYDRATE", state: loadBoard() });
    setHydrated(true);
  }, []);

  // Persiste a cada mudança, após a hidratação.
  useEffect(() => {
    if (hydrated) saveBoard(state);
  }, [state, hydrated]);

  const addColumn = useCallback((title: string) => {
    if (!title.trim()) return;
    dispatch({ type: "ADD_COLUMN", title });
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    dispatch({ type: "REMOVE_COLUMN", columnId });
  }, []);

  const renameColumn = useCallback((columnId: string, title: string) => {
    if (!title.trim()) return;
    dispatch({ type: "RENAME_COLUMN", columnId, title });
  }, []);

  const addTask = useCallback((columnId: string, task: NewTaskInput) => {
    if (!task.title.trim()) return;
    dispatch({ type: "ADD_TASK", columnId, task });
  }, []);

  const removeTask = useCallback((columnId: string, taskId: string) => {
    dispatch({ type: "REMOVE_TASK", columnId, taskId });
  }, []);

  const moveTask = useCallback((payload: MoveTaskInput) => {
    dispatch({ type: "MOVE_TASK", payload });
  }, []);

  const value = useMemo<BoardContextValue>(
    () => ({
      state,
      hydrated,
      search,
      setSearch,
      addColumn,
      removeColumn,
      renameColumn,
      addTask,
      removeTask,
      moveTask,
    }),
    [
      state,
      hydrated,
      search,
      addColumn,
      removeColumn,
      renameColumn,
      addTask,
      removeTask,
      moveTask,
    ],
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}
