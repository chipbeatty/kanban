export type Card = { id: string; title: string; details: string };
export type Column = { id: string; title: string; cardIds: string[] };
export type BoardState = { columns: Column[]; cards: Record<string, Card> };

export type BoardAction =
  | { type: "renameColumn"; columnId: string; title: string }
  | { type: "addCard"; columnId: string; card: Card }
  | { type: "deleteCard"; cardId: string }
  | { type: "moveCard"; cardId: string; toColumnId: string; toIndex: number };

export function findColumnId(state: BoardState, id: string) {
  if (state.columns.some((c) => c.id === id)) return id;
  return state.columns.find((c) => c.cardIds.includes(id))?.id;
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "renameColumn": {
      const title = action.title.trim();
      if (!title) return state;
      return {
        ...state,
        columns: state.columns.map((c) => (c.id === action.columnId ? { ...c, title } : c)),
      };
    }
    case "addCard":
      return {
        cards: { ...state.cards, [action.card.id]: action.card },
        columns: state.columns.map((c) =>
          c.id === action.columnId ? { ...c, cardIds: [...c.cardIds, action.card.id] } : c,
        ),
      };
    case "deleteCard": {
      const cards = { ...state.cards };
      delete cards[action.cardId];
      return {
        cards,
        columns: state.columns.map((c) => ({
          ...c,
          cardIds: c.cardIds.filter((id) => id !== action.cardId),
        })),
      };
    }
    case "moveCard": {
      const { cardId, toColumnId, toIndex } = action;
      const columns = state.columns.map((c) => ({
        ...c,
        cardIds: c.cardIds.filter((id) => id !== cardId),
      }));
      const target = columns.find((c) => c.id === toColumnId);
      if (!target) return state;
      target.cardIds.splice(toIndex, 0, cardId);
      return { ...state, columns };
    }
  }
}
