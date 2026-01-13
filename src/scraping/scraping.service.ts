import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScrapeJob, ScrapeStatus } from './scrape-job.schema';
import { runScrapingWorker } from './scraping.worker';

import { NavigationService } from '../navigation/navigation.service';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectModel(ScrapeJob.name)
    private readonly scrapeJobModel: Model<ScrapeJob>,
    private readonly navigationService: NavigationService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async enqueue(targetUrl: string, targetType: ScrapeJob['targetType']) {
    const existing = await this.scrapeJobModel.findOne({
      targetUrl,
      targetType,
      status: { $in: [ScrapeStatus.PENDING, ScrapeStatus.RUNNING] },
    });

    if (existing) return existing;

    return this.scrapeJobModel.create({
      targetUrl,
      targetType,
      status: ScrapeStatus.PENDING,
    });
  }

  async runNavigationScrape() {
    const crawler = await runScrapingWorker(
      this.navigationService,
      this.categoriesService,
      this.productsService,
    );

    await crawler.run([
      {
        url: 'https://www.worldofbooks.com/',
        userData: { type: 'navigation' },
      },
    ]);

    return { status: 'navigation scraped and saved' };
  }

  async runCategoryScrape(navigationSlug: string) {
    const navigation =
      await this.navigationService.findBySlug(navigationSlug);

    if (!navigation) throw new Error('Navigation not found');

    const isStale = await this.categoriesService.isStale(
      navigation._id.toString(),
    );

    if (!isStale) return { status: 'cache fresh – scrape skipped' };

    const crawler = await runScrapingWorker(
      this.navigationService,
      this.categoriesService,
      this.productsService,
    );

    await crawler.run([
      {
        url: `https://www.worldofbooks.com/category/${navigation.slug}`,
        userData: {
          type: 'category',
          navigationId: navigation._id.toString(),
        },
      },
    ]);

    return { status: 'categories scraped and saved' };
  }

  async runProductGridScrape(categorySlug: string) {
    const category =
      await this.categoriesService.findBySlug(categorySlug);

    if (!category) throw new Error('Category not found');

    const isStale = await this.productsService.isStale(
      category._id.toString(),
    );

    if (!isStale) return { status: 'cache fresh – scrape skipped' };

    const crawler = await runScrapingWorker(
      this.navigationService,
      this.categoriesService,
      this.productsService,
    );

    await crawler.run([
      {
        url: `https://www.worldofbooks.com/category/${category.slug}`,
        userData: {
          type: 'product-grid',
          categoryId: category._id.toString(),
        },
      },
    ]);

    return { status: 'products scraped and saved' };
  }

  async runProductDetailScrape(productId: string, sourceUrl: string) {
    const crawler = await runScrapingWorker(
      this.navigationService,
      this.categoriesService,
      this.productsService,
    );

    await crawler.run([
      {
        url: sourceUrl,
        userData: {
          type: 'product-detail',
          productId,
          sourceUrl,
        },
      },
    ]);

    return { status: 'product detail scraped and saved' };
  }
}
