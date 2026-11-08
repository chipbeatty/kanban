"use client";

import { useReducer, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { boardReducer, findColumnId } from "@/lib/board";
import { initialBoard } from "@/lib/initialData";
import Column from "./Column";
import { CardView } from "./Card";

export default function Board() {
  const [state, dispatch] = useReducer(boardReducer, initialBoard);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const targetIndex = (columnId: string, overId: string) => {
    const cardIds = state.columns.find((c) => c.id === columnId)!.cardIds;
    return overId === columnId ? cardIds.length : cardIds.indexOf(overId);
  };

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));

  // Move across columns while dragging so the target column opens a gap.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = findColumnId(state, String(active.id));
    const to = findColumnId(state, String(over.id));
    if (!from || !to || from === to) return;
    dispatch({
      type: "moveCard",
      cardId: String(active.id),
      toColumnId: to,
      toIndex: targetIndex(to, String(over.id)),
    });
  };

  // Reorder within the final column.
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;
    const to = findColumnId(state, String(over.id));
    if (!to) return;
    const cardIds = state.columns.find((c) => c.id === to)!.cardIds;
    const index = over.id === to ? cardIds.length - 1 : cardIds.indexOf(String(over.id));
    if (cardIds.indexOf(String(active.id)) !== index) {
      dispatch({ type: "moveCard", cardId: String(active.id), toColumnId: to, toIndex: index });
    }
  };

  const totalCards = Object.keys(state.cards).length;

  return (
    <div className="flex h-full flex-col">
      <header className="px-6 pt-8 pb-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
            Product Launch
          </h1>
        </div>
        <p className="mt-2 pl-[18px] text-sm text-muted">
          {state.columns.length} stages &middot; {totalCards} cards
        </p>
      </header>

      <DndContext
        id="board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <main className="flex min-h-0 flex-1 items-start gap-5 overflow-x-auto px-6 pb-8 sm:px-10">
          {state.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={column.cardIds.map((id) => state.cards[id])}
              onRename={(title) => dispatch({ type: "renameColumn", columnId: column.id, title })}
              onAdd={(title, details) =>
                dispatch({
                  type: "addCard",
                  columnId: column.id,
                  card: { id: crypto.randomUUID(), title, details },
                })
              }
              onDelete={(cardId) => dispatch({ type: "deleteCard", cardId })}
            />
          ))}
        </main>
        <DragOverlay>
          {activeId && <CardView card={state.cards[activeId]} overlay />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
