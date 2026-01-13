import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScrapingService } from './scraping.service';
import { ScrapeJob, ScrapeJobSchema } from './scrape-job.schema';

import { NavigationModule } from '../navigation/navigation.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScrapeJob.name, schema: ScrapeJobSchema },
    ]),
    forwardRef(() => NavigationModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => ProductsModule),
  ],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
