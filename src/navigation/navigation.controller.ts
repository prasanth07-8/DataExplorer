import { Controller, Get, Post } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('api/v1/navigation')
export class NavigationController {
  constructor(
    private readonly navigationService: NavigationService,
    private readonly scrapingService: ScrapingService,
  ) {}

  @Get()
  async getAll() {
    return this.navigationService.findAll();
  }

  // 🔒 Navigation scraping already handled in Phase 8.1
  @Post('refresh')
  async refresh() {
    return { status: 'navigation already scraped / TTL protected' };
  }
}
