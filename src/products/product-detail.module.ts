import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductDetailService } from './product-detail.service';
import { ProductDetail, ProductDetailSchema } from './product-detail.schema';
import { Review, ReviewSchema } from './review.schema';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductDetail.name, schema: ProductDetailSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    forwardRef(() => ScrapingModule),
  ],
  providers: [ProductDetailService],
  exports: [ProductDetailService], // 🔑 REQUIRED
})
export class ProductDetailModule {}
