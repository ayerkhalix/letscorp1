import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const routes = [
  "/",
  "/work/",
  "/work/?view=map",
  "/business/palawan-brew/",
  "/see/",
  "/travel/",
  "/chat/",
  "/chat/palawan-brew/",
  "/create/",
  "/create/request/",
  "/create/ai/",
  "/eat/",
  "/profile/",
  "/subscriptions/",
  "/admin/",
];
await mkdir(".sites-runtime/qa", { recursive: true });
const results = [];
const errors = [];
for (const width of [390, 768, 1024, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 1000 },
  });
  page.setDefaultTimeout(15000);
  page.on("pageerror", (error) => errors.push({ width, error: error.message }));
  for (const route of routes) {
    const response = await page.goto(`http://127.0.0.1:3000${route}`, {
      waitUntil: "domcontentloaded",
    });
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator("main h1:visible, .thread-header h3:visible")
      .first()
      .waitFor({ state: "visible" });
    await page.evaluate(() =>
      Promise.all(
        [...document.images]
          .filter((i) => i.src.includes("/images/"))
          .map((i) => {
            i.loading = "eager";
            return i.decode().catch(() => null);
          }),
      ),
    );
    console.log(`${width}: ${route}`);
    const metrics = await page.evaluate(() => ({
      viewport: innerWidth,
      width: document.documentElement.scrollWidth,
      images: [...document.images]
        .filter(
          (i) => i.src.includes("/images/") && (!i.complete || !i.naturalWidth),
        )
        .map((i) => i.src),
      nav: [...document.querySelectorAll(".bottom-nav a")].map((a) => ({
        label: a.textContent,
        width: a.getBoundingClientRect().width,
      })),
    }));
    results.push({
      route,
      width,
      status: response.status(),
      overflow: metrics.width > width,
      brokenImages: metrics.images,
      navUsable: width !== 390 || metrics.nav.every((n) => n.width >= 44),
    });
    if (
      [390, 1440].includes(width) &&
      [
        "/",
        "/business/palawan-brew/",
        "/travel/",
        "/chat/palawan-brew/",
        "/create/",
        "/create/ai/",
      ].includes(route)
    ) {
      await page.screenshot({
        path: `.sites-runtime/qa/${width}-${route.replaceAll("/", "-") || "home"}.png`,
        fullPage: true,
      });
    }
  }
  await page.close();
}
await browser.close();
await writeFile(
  ".sites-runtime/qa/results.json",
  JSON.stringify({ results, errors }, null, 2),
);
const failed = results.filter(
  (r) =>
    r.status !== 200 || r.overflow || r.brokenImages.length || !r.navUsable,
);
console.log(
  JSON.stringify(
    {
      viewports: 4,
      screens: routes.length,
      checks: results.length,
      failed,
      errors,
    },
    null,
    2,
  ),
);
if (failed.length || errors.length) process.exitCode = 1;
