import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Navigation } from './navigation.schema';
import { CreateNavigationDto } from './dto/create-navigation.dto';

const NAVIGATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name)
    private readonly navigationModel: Model<Navigation>,
  ) {}

  /**
   * Get all navigation items (used by GET /navigation)
   */
  async findAll(): Promise<Navigation[]> {
    return this.navigationModel.find().sort({ title: 1 }).lean();
  }

  /**
   * Find navigation by slug (REQUIRED for Phase 9 category scraping)
   */
  async findBySlug(slug: string): Promise<Navigation | null> {
    return this.navigationModel.findOne({ slug }).lean();
  }

  /**
   * Decide whether navigation scrape is needed (TTL check)
   */
  async isStale(): Promise<boolean> {
    const latest = await this.navigationModel
      .findOne()
      .sort({ lastScrapedAt: -1 })
      .lean();

    if (!latest || !latest.lastScrapedAt) return true;

    return (
      Date.now() - new Date(latest.lastScrapedAt).getTime() >
      NAVIGATION_TTL_MS
    );
  }

  /**
   * Upsert navigation item (used by scraper)
   */
  async upsert(dto: CreateNavigationDto) {
    return this.navigationModel.findOneAndUpdate(
      { slug: dto.slug },
      {
        $set: {
          title: dto.title,
          slug: dto.slug,
          lastScrapedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );
  }
}
