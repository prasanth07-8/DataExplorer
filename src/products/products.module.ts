import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Product, ProductSchema } from './product.schema';
import { ProductDetail, ProductDetailSchema } from './product-detail.schema';
import { Review, ReviewSchema } from './review.schema';
import { Category, CategorySchema } from '../categories/category.schema';

import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductDetail.name, schema: ProductDetailSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => ScrapingModule), // ✅ REQUIRED
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
