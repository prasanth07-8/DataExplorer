import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from './category.schema';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { Navigation, NavigationSchema } from '../navigation/navigation.schema';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Navigation.name, schema: NavigationSchema },
    ]),
    forwardRef(() => ScrapingModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
