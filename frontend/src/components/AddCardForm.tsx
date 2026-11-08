"use client";

import { useState } from "react";

export default function AddCardForm({ onAdd }: { onAdd: (title: string, details: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const close = () => {
    setOpen(false);
    setTitle("");
    setDetails("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
        Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title.trim(), details.trim());
        close();
      }}
      onKeyDown={(e) => e.key === "Escape" && close()}
      className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <input
        autoFocus
        aria-label="Card title"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-navy outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <textarea
        aria-label="Card details"
        placeholder="Details"
        rows={3}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="w-full resize-none rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-navy outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-secondary px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add card
        </button>
        <button
          type="button"
          onClick={close}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:text-navy"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
