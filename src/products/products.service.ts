import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Product } from './product.schema';
import { Category } from '../categories/category.schema';
import { ProductDetail } from './product-detail.schema';

const PRODUCT_TTL_MS = 6 * 60 * 60 * 1000;

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,

    @InjectModel(ProductDetail.name)
    private readonly productDetailModel: Model<ProductDetail>,
  ) {}

  async getByCategory(
    categorySlug: string,
    page = 1,
    limit = 20,
  ) {
    const category = await this.categoryModel.findOne({ slug: categorySlug });
    if (!category) throw new NotFoundException('Category not found');

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel
        .find({ categoryId: category._id })
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.productModel.countDocuments({ categoryId: category._id }),
    ]);

    return { page, limit, total, items };
  }

  async isStale(categoryId: string): Promise<boolean> {
    const latest = await this.productModel
      .findOne({ categoryId })
      .sort({ lastScrapedAt: -1 })
      .lean();

    if (!latest || !latest.lastScrapedAt) return true;

    return (
      Date.now() - new Date(latest.lastScrapedAt).getTime() >
      PRODUCT_TTL_MS
    );
  }

  async upsertProduct(categoryId: string, data: Partial<Product>) {
    if (!data.title || data.title.trim() === '') return null;
    if (!data.price || data.price <= 0) return null;
    if (!data.sourceUrl?.includes('worldofbooks.com')) return null;
    if (data.title.toLowerCase().includes('plus')) return null;
    if (data.sourceUrl.includes('onetrust')) return null;

    return this.productModel.findOneAndUpdate(
      { sourceId: data.sourceId },
      {
        $set: {
          ...data,
          categoryId: new Types.ObjectId(categoryId),
          lastScrapedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new NotFoundException('Invalid product id');
    }

    const product = await this.productModel.findById(productId).lean();
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async saveProductDetail(
    productId: string,
    data: {
      description: string;
      specs: Record<string, any>;
      ratingsAvg?: number;
    },
  ) {
    return this.productDetailModel.findOneAndUpdate(
      { productId },
      {
        $set: {
          ...data,
          productId: new Types.ObjectId(productId),
          lastScrapedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );
  }

  async getFullDetail(productId: string) {
    const product = await this.findById(productId);

    const detail = await this.productDetailModel
      .findOne({ productId })
      .lean();

    return {
      product,
      detail,
      reviews: [],
      recommendations: [],
    };
  }
}
