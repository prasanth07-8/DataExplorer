import { PlaywrightCrawler } from 'crawlee';

import { scrapeNavigation } from './spiders/navigation.spider';
import { scrapeCategories } from './spiders/category.spider';
import { scrapeProductGrid } from './spiders/product-grid.spider';
import { scrapeProductDetail } from './spiders/product-detail.spider';

import { NavigationService } from '../navigation/navigation.service';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';

export async function runScrapingWorker(
  navigationService: NavigationService,
  categoriesService: CategoriesService,
  productsService: ProductsService,
) {
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    requestHandlerTimeoutSecs: 60,

    async requestHandler({ request, page, log }) {
      /**
       * ───────────────────────────────
       * NAVIGATION SCRAPE
       * ───────────────────────────────
       */
      if (request.userData.type === 'navigation') {
        const items = await scrapeNavigation(page);

        for (const item of items) {
          await navigationService.upsert(item);
        }

        log.info(`Saved ${items.length} navigation items`);
      }

      /**
       * ───────────────────────────────
       * CATEGORY SCRAPE
       * ───────────────────────────────
       */
      if (request.userData.type === 'category') {
        const { navigationId } = request.userData;

        const items = await scrapeCategories(page);

        for (const item of items) {
          await categoriesService.upsertCategory(navigationId, {
            title: item.title,
            slug: item.slug,
            parentId: null,
          });
        }

        log.info(`Saved ${items.length} categories`);
      }

      /**
       * ───────────────────────────────
       * PRODUCT GRID SCRAPE
       * ───────────────────────────────
       */
      if (request.userData.type === 'product-grid') {
        const { categoryId } = request.userData;

        const items = await scrapeProductGrid(page);

        for (const item of items) {
          await productsService.upsertProduct(categoryId, item);
        }

        log.info(`Saved ${items.length} products`);
      }

      /**
       * ───────────────────────────────
       * PRODUCT DETAIL SCRAPE (PHASE 11)
       * ───────────────────────────────
       */
      if (request.userData.type === 'product-detail') {
        const { productId, sourceUrl } = request.userData;

        await page.goto(sourceUrl, {
          waitUntil: 'domcontentloaded',
        });

        const detail = await scrapeProductDetail(page);

        await productsService.saveProductDetail(productId, detail);

        log.info(`Saved product detail for ${productId}`);
      }
    },
  });

  return crawler;
}
