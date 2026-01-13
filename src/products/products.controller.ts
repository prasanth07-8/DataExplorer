import { Controller, Get, Query, Post, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('api/v1/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly scrapingService: ScrapingService,
  ) {}

  /**
   * PRODUCT GRID
   */
  @Get()
  async getByCategory(
    @Query('categorySlug') categorySlug: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.productsService.getByCategory(
      categorySlug,
      Number(page),
      Number(limit),
    );
  }

  @Post(':categorySlug/refresh')
  async refreshGrid(@Param('categorySlug') slug: string) {
    return this.scrapingService.runProductGridScrape(slug);
  }

  /**
   * PRODUCT DETAIL
   */
  @Get(':productId')
  async getDetail(@Param('productId') productId: string) {
    return this.productsService.getFullDetail(productId);
  }

  @Post(':productId/refresh')
  async refreshDetail(@Param('productId') productId: string) {
    const product = await this.productsService.findById(productId);
    return this.scrapingService.runProductDetailScrape(
      productId,
      product.sourceUrl,
    );
  }
}
