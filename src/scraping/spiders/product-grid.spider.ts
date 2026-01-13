import { Page } from 'playwright';

export type ProductGridItem = {
  sourceId: string;
  title: string;
  author?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
};

export async function scrapeProductGrid(
  page: Page,
): Promise<ProductGridItem[]> {
  await page.waitForLoadState('domcontentloaded');

  const rawItems = await page.$$eval(
    '[data-testid="product-tile"], a[href*="/products/"]',
    (nodes) =>
      nodes.map((el) => {
        const link =
          el.getAttribute('href') ||
          el.querySelector('a')?.getAttribute('href');

        if (!link) return null;

        const sourceUrl = link.startsWith('http')
          ? link
          : `https://www.worldofbooks.com${link}`;

        const sourceId =
          sourceUrl.split('/').filter(Boolean).pop() ?? sourceUrl;

        const title =
          el.querySelector('h3')?.textContent?.trim() ??
          el.textContent?.trim() ??
          '';

        const priceText =
          el.textContent?.match(/£\s?\d+(\.\d{2})?/i)?.[0];

        const price = priceText
          ? parseFloat(priceText.replace('£', ''))
          : 0;

        const imageUrl =
          el.querySelector('img')?.getAttribute('src') ?? undefined;

        return {
          sourceId,
          title,
          price,
          currency: 'GBP',
          imageUrl,
          sourceUrl,
        };
      }),
  );

  /**
   * ✅ STEP 1: Remove nulls (runtime-safe)
   */
  const withoutNulls = rawItems.filter(
    (item) => item !== null,
  );

  /**
   * ✅ STEP 2: Business filtering
   */
  const validProducts = withoutNulls.filter((item) => {
    if (!item.title || item.title.trim().length === 0) return false;
    if (!item.price || item.price <= 0) return false;
    if (!item.sourceUrl.includes('worldofbooks.com')) return false;
    if (item.title.toLowerCase().includes('plus')) return false;
    if (item.sourceUrl.includes('onetrust')) return false;
    return true;
  });

  /**
   * ✅ STEP 3: Final cast (safe after filtering)
   */
  return validProducts as ProductGridItem[];
}
