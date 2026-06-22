"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoard } from "@/hooks/use-board";

/** Botão que vira um formulário inline para criar uma nova esteira. */
export function AddColumn() {
  const { addColumn } = useBoard();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function submit() {
    if (!title.trim()) {
      setEditing(false);
      return;
    }
    addColumn(title);
    setTitle("");
    setEditing(false);
  }

  if (!editing) {
    return (
      <Button
        variant="secondary"
        onClick={() => setEditing(true)}
        className="h-11 w-72 shrink-0 justify-start gap-2 rounded-2xl border border-dashed border-border bg-muted/40 text-muted-foreground hover:bg-muted/70"
      >
        <Plus className="size-4" />
        Adicionar esteira
      </Button>
    );
  }

  return (
    <div className="w-72 shrink-0 rounded-2xl bg-muted/60 p-2 ring-1 ring-border/50">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") {
            setTitle("");
            setEditing(false);
          }
        }}
        placeholder="Nome da esteira"
        className="mb-2 bg-background"
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={submit} disabled={!title.trim()}>
          Adicionar
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          aria-label="Cancelar"
          onClick={() => {
            setTitle("");
            setEditing(false);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
