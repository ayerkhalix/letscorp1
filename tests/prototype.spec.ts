import { test, expect } from "@playwright/test";

test("all six services stay visible and render meaningful screens", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Good things are close by." }),
  ).toBeVisible();
  for (const [label, title] of [
    ["Eat", "Let’s Eat"],
    ["Work", "Let’s Work"],
    ["See", "Let’s See"],
    ["Travel", "Let’s Travel"],
    ["Chat", "Let’s Chat"],
    ["Create", "Let’s Create"],
  ]) {
    const nav = page
      .getByRole("navigation", { name: "Services" })
      .filter({ has: page.locator("a:visible") })
      .last();
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: new RegExp(`^${title}`), level: 1 }),
    ).toBeVisible();
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link")).toHaveCount(6);
  }
});

test("directory search, offline markers, business detail and messaging form one flow", async ({
  page,
}) => {
  await page.goto("/work/");
  await page
    .getByRole("textbox", { name: "Search businesses" })
    .fill("Palawan Brew");
  await expect(page.locator(".directory-grid .business-card")).toHaveCount(1);
  await page.getByRole("tab", { name: "Map", exact: true }).click();
  const offline = page.getByRole("button", {
    name: "Offline preview",
    exact: true,
  });
  if (await offline.isVisible()) await offline.click();
  await page
    .getByRole("button", { name: "View Palawan Brew Café on map" })
    .click();
  await page.locator(".map-preview a").click();
  await expect(
    page.getByRole("heading", { name: "Palawan Brew Café", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save place", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saved", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Message Business", exact: true })
    .click();
  await expect(page).toHaveURL(/chat\/palawan-brew/);
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Can I reserve a table for two?");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("Can I reserve a table for two?", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".chat-messages").getByText(/This is a demo reply/),
  ).toBeVisible();
  await page.goto("/profile/");
  await expect(
    page
      .locator(".profile-saved-grid")
      .getByRole("heading", { name: "Palawan Brew Café" }),
  ).toBeVisible();
});

test("promotions like, save, comments and location open connected views", async ({
  page,
}) => {
  await page.goto("/see/coffee-weekend/");
  const post = page.locator(".feed-post");
  const like = post.locator(".post-actions button").first();
  await like.click();
  await expect(like).toHaveAttribute("aria-pressed", "true");
  await post.getByRole("button", { name: "Save post", exact: true }).click();
  await expect(
    post.getByRole("button", { name: "Unsave post", exact: true }),
  ).toBeVisible();
  await post.getByRole("button", { name: /Comment/ }).click();
  await page
    .getByRole("textbox", { name: "Write a comment" })
    .fill("See you this weekend!");
  await page.getByRole("button", { name: "Post comment" }).click();
  await expect(page.locator(".comments-list")).toContainText(
    "See you this weekend!",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await post.locator(".post-location").click();
  await expect(page).toHaveURL(/focus=palawan-brew/);
  await expect(page.locator(".app-map")).toBeVisible();
});

test("creative request preserves the brief, submits, tracks and accepts revision feedback", async ({
  page,
}) => {
  await page.goto("/create/request/?package=three-graphics");
  await page
    .getByRole("textbox", { name: "Business name *", exact: true })
    .fill("Island Demo Café");
  await page
    .getByRole("textbox", { name: "Contact email *", exact: true })
    .fill("owner@example.test");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Promotion title *", exact: true })
    .fill("A weekend on the island");
  await page
    .getByRole("textbox", { name: "What are you promoting? *", exact: true })
    .fill("Fresh coffee and local pastries. 20% off this weekend.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Use sample logo" }).click();
  await page.getByRole("button", { name: "Use sample photo" }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Promotion title *", exact: true }),
  ).toHaveValue("A weekend on the island");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".uploaded-assets>div")).toHaveCount(2);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Additional instructions" })
    .fill("Please use a warm, welcoming style.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".request-review")).toContainText(
    "Island Demo Café",
  );
  await page
    .getByRole("button", { name: "Submit request", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your request has been submitted." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View Order", exact: true }).click();
  await expect(page.locator(".order-timeline li.current")).toContainText(
    "Submitted",
  );
  await expect(page.locator(".order-information")).toContainText(
    "Island Demo Café",
  );
  await page
    .getByRole("combobox", { name: "Preview order status" })
    .selectOption("3");
  await page.getByRole("button", { name: "Request revision" }).click();
  await page
    .getByRole("textbox", { name: "Your feedback" })
    .fill("Please make the offer larger.");
  await page.getByRole("button", { name: "Send revision request" }).click();
  await expect(page.locator(".revision-note")).toContainText(
    "Please make the offer larger.",
  );
  await page.reload();
  await expect(page.locator(".revision-note")).toContainText(
    "Please make the offer larger.",
  );
});

test("mock AI generation returns selectable and savable results", async ({
  page,
}) => {
  await page.goto("/create/ai/");
  await page.getByRole("button", { name: "Generate", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your sample results" }),
  ).toBeVisible();
  await expect(page.locator(".ai-result-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Select sample result 2" }).click();
  await page.getByRole("button", { name: "Save result", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saved result", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("lets-corp-ai-results") || "[]")
            .length,
      ),
    )
    .toBe(1);
});

test("role switching exposes business tools and subscriptions with sample prices", async ({
  page,
}) => {
  await page.goto("/profile/");
  await page.getByRole("button", { name: "Business", exact: true }).click();
  await expect(page.locator(".business-management")).toBeVisible();
  await page.getByRole("link", { name: "Your subscription" }).click();
  await expect(page.locator(".entry-tier")).toContainText("₱100");
  await expect(page.locator(".prototype-notice")).toContainText(
    "fictional placeholders",
  );
  await page
    .locator(".entry-tier")
    .getByRole("button", { name: "Choose Plan" })
    .click();
  await page
    .getByRole("textbox", { name: "Business name" })
    .fill("Demo business");
  await page
    .getByRole("textbox", { name: "Contact email" })
    .fill("owner@example.test");
  await page.getByRole("button", { name: "Register demo interest" }).click();
  await expect(page.getByText(/Entry interest recorded/)).toBeVisible();
});

test("WebMCP registration validates inputs and uses the same visible favorites state", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const registry: Record<string, unknown> = {};
    Object.defineProperty(document, "modelContext", {
      value: {
        registerTool(tool: { name: string }, options: { signal: AbortSignal }) {
          registry[tool.name] = tool;
          options.signal.addEventListener(
            "abort",
            () => delete registry[tool.name],
          );
        },
      },
    });
    (window as unknown as { demoTools: unknown }).demoTools = registry;
  });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Object.keys(
            (window as unknown as { demoTools: Record<string, unknown> })
              .demoTools,
          ).length,
      ),
    )
    .toBe(3);
  const result = await page.evaluate(() => {
    const tools = (
      window as unknown as {
        demoTools: Record<string, { execute: (value: unknown) => unknown }>;
      }
    ).demoTools;
    return tools.search_local_places.execute({ query: "Palawan Brew" });
  });
  expect(result).toMatchObject({ places: [{ id: "palawan-brew" }] });
  await page.evaluate(() => {
    const tools = (
      window as unknown as {
        demoTools: Record<string, { execute: (value: unknown) => unknown }>;
      }
    ).demoTools;
    tools.save_local_places.execute({ ids: ["palawan-brew"] });
  });
  await expect(
    page.getByRole("button", { name: "Unsave Palawan Brew Café" }),
  ).toBeVisible();
  const error = await page.evaluate(() => {
    try {
      const tools = (
        window as unknown as {
          demoTools: Record<string, { execute: (value: unknown) => unknown }>;
        }
      ).demoTools;
      tools.save_local_places.execute({ ids: ["nonexistent"] });
      return "no error";
    } catch (e) {
      return String(e);
    }
  });
  expect(error).toContain("known directory IDs");
  await expect(
    page.getByRole("button", { name: "Unsave Palawan Brew Café" }),
  ).toBeVisible();
});

test("unified search connects to travel and same-page query navigation updates the map", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Search businesses, services, places" })
    .fill("Honda Bay Island");
  await page
    .locator(".search-results")
    .getByRole("link", { name: /Honda Bay Island Adventures/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Honda Bay Island Adventures",
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View on Map", exact: true }).click();
  await expect(page.locator(".map-preview")).toContainText(
    "Honda Bay Island Adventures",
  );
  // Use the real business-to-map navigation path after a client-side route change.
  await page.goto("/business/luna-studio/");
  await page.getByRole("link", { name: "View on Map", exact: true }).click();
  await expect(page.locator(".map-preview")).toContainText(
    "Luna Beauty Studio",
  );
});

test("a failed map provider automatically switches to an interactive fallback", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.goto("/work/?view=map");
  await expect(
    page.getByText("Offline map preview", { exact: true }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.locator(".fallback-marker")).toHaveCount(16);
  await page
    .getByRole("button", { name: "View Luna Beauty Studio on map" })
    .click();
  await expect(page.locator(".map-preview")).toContainText(
    "Luna Beauty Studio",
  );
});
