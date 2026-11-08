import { describe, expect, it } from "vitest";
import { boardReducer, findColumnId, type BoardState } from "./board";
import { initialBoard } from "./initialData";

const base: BoardState = {
  cards: {
    a: { id: "a", title: "A", details: "" },
    b: { id: "b", title: "B", details: "" },
    c: { id: "c", title: "C", details: "" },
  },
  columns: [
    { id: "one", title: "One", cardIds: ["a", "b"] },
    { id: "two", title: "Two", cardIds: ["c"] },
    { id: "three", title: "Three", cardIds: [] },
  ],
};

const ids = (s: BoardState) => s.columns.map((c) => c.cardIds);

describe("initialBoard", () => {
  it("has 5 columns and every card id resolves to a card", () => {
    expect(initialBoard.columns).toHaveLength(5);
    const all = initialBoard.columns.flatMap((c) => c.cardIds);
    expect(all.length).toBeGreaterThan(0);
    all.forEach((id) => expect(initialBoard.cards[id]).toBeDefined());
  });
});

describe("renameColumn", () => {
  it("renames and trims", () => {
    const s = boardReducer(base, { type: "renameColumn", columnId: "two", title: "  Doing  " });
    expect(s.columns[1].title).toBe("Doing");
  });

  it("ignores empty titles", () => {
    const s = boardReducer(base, { type: "renameColumn", columnId: "two", title: "   " });
    expect(s).toBe(base);
  });
});

describe("addCard", () => {
  it("appends the card to the column", () => {
    const card = { id: "d", title: "D", details: "x" };
    const s = boardReducer(base, { type: "addCard", columnId: "three", card });
    expect(s.cards.d).toEqual(card);
    expect(s.columns[2].cardIds).toEqual(["d"]);
  });
});

describe("deleteCard", () => {
  it("removes the card and its reference", () => {
    const s = boardReducer(base, { type: "deleteCard", cardId: "a" });
    expect(s.cards.a).toBeUndefined();
    expect(ids(s)).toEqual([["b"], ["c"], []]);
  });
});

describe("moveCard", () => {
  it("reorders within a column", () => {
    const s = boardReducer(base, { type: "moveCard", cardId: "a", toColumnId: "one", toIndex: 1 });
    expect(ids(s)).toEqual([["b", "a"], ["c"], []]);
  });

  it("moves to another column at an index", () => {
    const s = boardReducer(base, { type: "moveCard", cardId: "b", toColumnId: "two", toIndex: 0 });
    expect(ids(s)).toEqual([["a"], ["b", "c"], []]);
  });

  it("moves into an empty column", () => {
    const s = boardReducer(base, { type: "moveCard", cardId: "c", toColumnId: "three", toIndex: 0 });
    expect(ids(s)).toEqual([["a", "b"], [], ["c"]]);
  });
});

describe("immutability", () => {
  it("does not mutate the previous state", () => {
    const snapshot = structuredClone(base);
    boardReducer(base, { type: "moveCard", cardId: "a", toColumnId: "two", toIndex: 0 });
    boardReducer(base, { type: "deleteCard", cardId: "b" });
    boardReducer(base, { type: "addCard", columnId: "one", card: { id: "z", title: "Z", details: "" } });
    expect(base).toEqual(snapshot);
  });
});

describe("findColumnId", () => {
  it("resolves column ids and card ids", () => {
    expect(findColumnId(base, "two")).toBe("two");
    expect(findColumnId(base, "b")).toBe("one");
    expect(findColumnId(base, "nope")).toBeUndefined();
  });
});
