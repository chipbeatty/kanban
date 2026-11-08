"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/board";

type ViewProps = { card: CardType; overlay?: boolean; onDelete?: () => void };

export function CardView({ card, overlay, onDelete }: ViewProps) {
  return (
    <div
      className={`group relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(3_33_71/0.06)] transition-shadow hover:shadow-[0_6px_16px_rgb(3_33_71/0.08)] ${
        overlay ? "rotate-2 cursor-grabbing shadow-[0_16px_32px_rgb(3_33_71/0.18)]" : "cursor-grab"
      }`}
    >
      <h3 className="pr-7 text-sm font-medium leading-snug text-navy">{card.title}</h3>
      {card.details && <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{card.details}</p>}
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          onClick={onDelete}
          onKeyDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 rounded-md p-1 text-muted opacity-0 transition hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary group-hover:opacity-100"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Card({ card, onDelete }: { card: CardType; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isDragging ? "opacity-40" : ""
      }`}
      data-testid="card"
      aria-label={card.title}
      {...attributes}
      {...listeners}
    >
      <CardView card={card} onDelete={onDelete} />
    </li>
  );
}
