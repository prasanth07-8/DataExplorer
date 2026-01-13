import { Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly scrapingService: ScrapingService,
  ) {}

  @Get(':navigationSlug')
  async getByNavigation(@Param('navigationSlug') slug: string) {
    return this.categoriesService.findByNavigationSlug(slug);
  }

  @Post(':navigationSlug/refresh')
  async refresh(@Param('navigationSlug') slug: string) {
    return this.scrapingService.runCategoryScrape(slug);
  }
}
