import { Page } from 'playwright';

export type CategoryItem = {
  title: string;
  slug: string;
};

export async function scrapeCategories(page: Page): Promise<CategoryItem[]> {
  await page.waitForLoadState('domcontentloaded');

  const categories = await page.$$eval(
    'a[href*="/category/"]',
    (links) => {
      const seen = new Set<string>();

      return links
        .map((el) => {
          const title = el.textContent?.trim();
          const href = el.getAttribute('href');
          if (!title || !href) return null;

          const parts = href.split('/').filter(Boolean);
          const slug = parts[parts.length - 1]?.toLowerCase();

          if (!slug || seen.has(slug)) return null;
          seen.add(slug);

          return { title, slug };
        })
        .filter(Boolean);
    },
  );

  return categories as CategoryItem[];
}
