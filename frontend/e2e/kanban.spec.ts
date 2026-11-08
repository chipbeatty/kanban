import { expect, test, type Locator, type Page } from "@playwright/test";

const column = (page: Page, name: string) => page.getByRole("region", { name });

async function drag(page: Page, source: Locator, target: Locator) {
  const from = (await source.boundingBox())!;
  const to = (await target.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2, { steps: 5 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByTestId("column")).toHaveCount(5);
  expect(errors).toEqual([]);
});

test("loads 5 columns with dummy cards", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const name of ["Backlog", "To Do", "In Progress", "Review", "Done"]) {
    await expect(column(page, name).getByTestId("card").first()).toBeVisible();
  }
});

test("renames a column", async ({ page }) => {
  await page.getByRole("button", { name: "Backlog" }).click();
  await page.getByLabel("Column name").fill("Ideas");
  await page.keyboard.press("Enter");
  await expect(column(page, "Ideas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Backlog" })).toHaveCount(0);
});

test("adds and deletes a card", async ({ page }) => {
  const todo = column(page, "To Do");
  await todo.getByRole("button", { name: "Add card" }).click();
  await todo.getByLabel("Card title").fill("Write e2e tests");
  await todo.getByLabel("Card details").fill("Cover the main flows");
  await todo.getByRole("button", { name: "Add card" }).click();
  await expect(todo.getByText("Write e2e tests")).toBeVisible();
  await expect(todo.getByTestId("card")).toHaveCount(3);

  await todo.getByTestId("card").filter({ hasText: "Write e2e tests" }).hover();
  await todo.getByRole("button", { name: "Delete Write e2e tests" }).click();
  await expect(todo.getByText("Write e2e tests")).toHaveCount(0);
  await expect(todo.getByTestId("card")).toHaveCount(2);
});

test("drags a card to another column", async ({ page }) => {
  const card = column(page, "Backlog").getByTestId("card").filter({ hasText: "Define Q3 roadmap" });
  const target = column(page, "Done").getByTestId("card").first();
  await drag(page, card, target);
  await expect(column(page, "Done").getByText("Define Q3 roadmap")).toBeVisible();
  await expect(column(page, "Backlog").getByText("Define Q3 roadmap")).toHaveCount(0);
});

test("drags a card into an emptied column", async ({ page }) => {
  const review = column(page, "Review");
  for (const title of ["API rate limiting", "Release notes v2.4"]) {
    await review.getByTestId("card").filter({ hasText: title }).hover();
    await review.getByRole("button", { name: `Delete ${title}` }).click();
  }
  await expect(review.getByText("Drop cards here")).toBeVisible();
  const card = column(page, "To Do").getByTestId("card").first();
  await drag(page, card, review.getByText("Drop cards here"));
  await expect(review.getByText("Design system audit")).toBeVisible();
});

test("reorders cards within a column", async ({ page }) => {
  const backlog = column(page, "Backlog");
  const cards = backlog.getByTestId("card");
  await drag(page, cards.nth(0), cards.nth(2));
  await expect(cards.nth(2)).toContainText("Define Q3 roadmap");
});

test("screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.screenshot({ path: "test-results/board.png" });
});

test("mobile screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/board-mobile.png" });
});
