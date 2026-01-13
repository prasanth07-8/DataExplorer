import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './category.schema';
import { Navigation } from '../navigation/navigation.schema';

const CATEGORY_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,

    @InjectModel(Navigation.name)
    private readonly navigationModel: Model<Navigation>,
  ) {}

  /**
   * Get categories by navigation slug
   * GET /api/v1/categories/:navigationSlug
   */
  async findByNavigationSlug(slug: string) {
    const navigation = await this.navigationModel.findOne({ slug });
    if (!navigation) {
      throw new NotFoundException('Navigation not found');
    }

    return this.categoryModel
      .find({ navigationId: navigation._id, parentId: null })
      .sort({ title: 1 })
      .lean();
  }

  /**
   * Find single category by slug
   * REQUIRED for Phase 10 (product grid scraping)
   */
  async findBySlug(slug: string) {
    return this.categoryModel.findOne({ slug }).lean();
  }

  /**
   * TTL check for category scraping
   */
  async isStale(navigationId: string): Promise<boolean> {
    const latest = await this.categoryModel
      .findOne({ navigationId })
      .sort({ lastScrapedAt: -1 })
      .lean();

    if (!latest || !latest.lastScrapedAt) return true;

    return (
      Date.now() - new Date(latest.lastScrapedAt).getTime() >
      CATEGORY_TTL_MS
    );
  }

  /**
   * Upsert category (used by scraper)
   */
  async upsertCategory(
    navigationId: string,
    data: { title: string; slug: string; parentId?: string | null },
  ) {
    return this.categoryModel.findOneAndUpdate(
      { slug: data.slug },
      {
        $set: {
          title: data.title,
          slug: data.slug,
          navigationId: new Types.ObjectId(navigationId),
          parentId: data.parentId
            ? new Types.ObjectId(data.parentId)
            : null,
          lastScrapedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );
  }
}
