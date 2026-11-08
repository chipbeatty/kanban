import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Board from "./Board";

const column = (name: string) => screen.getByRole("region", { name });

describe("Board", () => {
  it("renders 5 columns with dummy cards", () => {
    render(<Board />);
    expect(screen.getAllByTestId("column")).toHaveLength(5);
    expect(screen.getAllByTestId("card").length).toBeGreaterThan(0);
    expect(within(column("Backlog")).getByText("Define Q3 roadmap")).toBeInTheDocument();
  });

  it("renames a column with Enter and cancels with Escape", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "To Do" }));
    const input = screen.getByLabelText("Column name");
    await user.clear(input);
    await user.type(input, "Next Up{Enter}");
    expect(screen.getByRole("region", { name: "Next Up" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next Up" }));
    await user.type(screen.getByLabelText("Column name"), "zzz{Escape}");
    expect(screen.getByRole("region", { name: "Next Up" })).toBeInTheDocument();
  });

  it("adds a card to a column", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const done = column("Done");
    await user.click(within(done).getByRole("button", { name: "Add card" }));
    await user.type(within(done).getByLabelText("Card title"), "Ship it");
    await user.type(within(done).getByLabelText("Card details"), "Final checks");
    await user.click(within(done).getByRole("button", { name: "Add card" }));
    expect(within(done).getByText("Ship it")).toBeInTheDocument();
    expect(within(done).getByText("Final checks")).toBeInTheDocument();
    expect(within(done).queryByLabelText("Card title")).not.toBeInTheDocument();
  });

  it("does not add a card with an empty title", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const review = column("Review");
    const before = within(review).getAllByTestId("card").length;
    await user.click(within(review).getByRole("button", { name: "Add card" }));
    await user.type(within(review).getByLabelText("Card title"), "   ");
    expect(within(review).getByRole("button", { name: "Add card" })).toBeDisabled();
    expect(within(review).getAllByTestId("card")).toHaveLength(before);
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Delete Competitive analysis" }));
    expect(screen.queryByText("Competitive analysis")).not.toBeInTheDocument();
  });
});
