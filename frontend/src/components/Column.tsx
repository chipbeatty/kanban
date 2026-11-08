"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Card as CardType, Column as ColumnType } from "@/lib/board";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

type Props = {
  column: ColumnType;
  cards: CardType[];
  onRename: (title: string) => void;
  onAdd: (title: string, details: string) => void;
  onDelete: (cardId: string) => void;
};

export default function Column({ column, cards, onRename, onAdd, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);

  const save = (value: string) => {
    onRename(value);
    setEditing(false);
  };

  return (
    <section
      aria-label={column.title}
      data-testid="column"
      className="flex max-h-full w-72 shrink-0 flex-col rounded-2xl border border-slate-200/70 bg-slate-50/80 shadow-sm backdrop-blur"
    >
      <div className="h-1 rounded-t-2xl bg-accent" />
      <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
        {editing ? (
          <input
            autoFocus
            aria-label="Column name"
            defaultValue={column.title}
            onBlur={(e) => save(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save(e.currentTarget.value);
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full rounded-md border border-primary bg-white px-2 py-1 text-sm font-semibold text-navy outline-none ring-2 ring-primary/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Click to rename"
            className="truncate rounded-md px-2 py-1 text-left text-sm font-semibold text-navy transition hover:bg-slate-200/60 focus-visible:outline-2 focus-visible:outline-primary"
          >
            {column.title}
          </button>
        )}
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-muted ring-1 ring-slate-200">
          {cards.length}
        </span>
      </div>

      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className={`mx-2 flex min-h-24 flex-col gap-2.5 overflow-y-auto rounded-xl p-2 transition-colors ${
            isOver ? "bg-primary/5" : ""
          }`}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} onDelete={() => onDelete(card.id)} />
          ))}
          {cards.length === 0 && (
            <li className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-xs text-muted">
              Drop cards here
            </li>
          )}
        </ul>
      </SortableContext>

      <div className="p-3 pt-1">
        <AddCardForm onAdd={onAdd} />
      </div>
    </section>
  );
}
