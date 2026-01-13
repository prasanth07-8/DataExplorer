import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Navigation, NavigationSchema } from './navigation.schema';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Navigation.name, schema: NavigationSchema },
    ]),
    forwardRef(() => ScrapingModule), // ✅ FIX
  ],
  controllers: [NavigationController],
  providers: [NavigationService],
  exports: [NavigationService], // IMPORTANT
})
export class NavigationModule {}
