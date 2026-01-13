import { Page } from 'playwright';

export type ProductDetailScrape = {
  description: string;
  specs: Record<string, string>;
  ratingsAvg?: number;
};

export async function scrapeProductDetail(
  page: Page,
): Promise<ProductDetailScrape> {
  await page.waitForLoadState('domcontentloaded');

  const description =
    (await page.textContent('[data-testid="product-description"]')) ??
    '';

  const specs = await page.$$eval(
    '[data-testid="product-spec"]',
    (rows) => {
      const result: Record<string, string> = {};
      rows.forEach((row) => {
        const key = row.querySelector('dt')?.textContent?.trim();
        const value = row.querySelector('dd')?.textContent?.trim();
        if (key && value) result[key] = value;
      });
      return result;
    },
  );

  const ratingText =
    (await page.textContent('[data-testid="rating"]')) ?? '';

  const ratingsAvg = ratingText
    ? parseFloat(ratingText)
    : undefined;

  return {
    description,
    specs,
    ratingsAvg,
  };
}
