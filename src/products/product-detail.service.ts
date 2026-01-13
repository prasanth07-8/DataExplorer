import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDetail } from './product-detail.schema';
import { Review } from './review.schema';

const PRODUCT_DETAIL_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectModel(ProductDetail.name)
    private readonly detailModel: Model<ProductDetail>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,
  ) {}

  async isStale(productId: string): Promise<boolean> {
    const detail = await this.detailModel.findOne({
      productId: new Types.ObjectId(productId),
    });

    if (!detail || !detail.lastScrapedAt) return true;

    return (
      Date.now() - new Date(detail.lastScrapedAt).getTime() >
      PRODUCT_DETAIL_TTL_MS
    );
  }

  async saveDetail(productId: string, data: any) {
    await this.detailModel.findOneAndUpdate(
      { productId },
      {
        $set: {
          productId,
          description: data.description,
          specs: data.specs,
          ratingAvg: data.ratingAvg,
          reviewsCount: data.reviewsCount,
          lastScrapedAt: new Date(),
        },
      },
      { upsert: true },
    );

    await this.reviewModel.deleteMany({ productId });

    if (data.reviews?.length) {
      await this.reviewModel.insertMany(
        data.reviews.map((r) => ({
          ...r,
          productId,
        })),
      );
    }
  }
}
