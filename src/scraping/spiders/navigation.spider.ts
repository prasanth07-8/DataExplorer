import { Page } from 'playwright';

export type NavigationItem = {
  title: string;
  slug: string;
};

export async function scrapeNavigation(page: Page): Promise<NavigationItem[]> {
  // Wait for header / nav to load
  await page.waitForLoadState('domcontentloaded');

  // This selector may evolve — keep logic defensive
  const items = await page.$$eval(
    'a[href*="/collections/"], a[href*="/category/"]',
    (links) => {
      const seen = new Set<string>();
      return links
        .map((el) => {
          const title = el.textContent?.trim();
          const href = el.getAttribute('href');
          if (!title || !href) return null;

          const slug = href
            .split('/')
            .filter(Boolean)
            .pop()
            ?.toLowerCase();

          if (!slug || seen.has(slug)) return null;
          seen.add(slug);

          return { title, slug };
        })
        .filter(Boolean);
    },
  );

  return items as NavigationItem[];
}
