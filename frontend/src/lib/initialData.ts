import type { BoardState, Card } from "./board";

const cardList: Card[] = [
  { id: "c1", title: "Define Q3 roadmap", details: "Align with product leads on the top three themes for next quarter." },
  { id: "c2", title: "Competitive analysis", details: "Review pricing and onboarding flows of the four main competitors." },
  { id: "c3", title: "Customer interview script", details: "Draft open-ended questions for the upcoming research sessions." },
  { id: "c4", title: "Design system audit", details: "Catalogue inconsistent button and input styles across the app." },
  { id: "c5", title: "Set up analytics events", details: "Instrument sign-up, activation and first-project milestones." },
  { id: "c6", title: "Billing page redesign", details: "Simplify plan comparison and surface annual savings clearly." },
  { id: "c7", title: "Onboarding checklist", details: "Guide new users through their first three key actions." },
  { id: "c8", title: "API rate limiting", details: "Review token bucket limits and error responses with backend team." },
  { id: "c9", title: "Release notes v2.4", details: "Summarise new features and fixes for the changelog and email." },
  { id: "c10", title: "Migrate to new CDN", details: "Static assets now served from the edge with improved cache hit rate." },
  { id: "c11", title: "Accessibility pass", details: "Keyboard navigation and contrast fixes across settings pages." },
];

export const initialBoard: BoardState = {
  cards: Object.fromEntries(cardList.map((c) => [c.id, c])),
  columns: [
    { id: "backlog", title: "Backlog", cardIds: ["c1", "c2", "c3"] },
    { id: "todo", title: "To Do", cardIds: ["c4", "c5"] },
    { id: "progress", title: "In Progress", cardIds: ["c6", "c7"] },
    { id: "review", title: "Review", cardIds: ["c8", "c9"] },
    { id: "done", title: "Done", cardIds: ["c10", "c11"] },
  ],
};
