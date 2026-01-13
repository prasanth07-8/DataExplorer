import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProductDetail extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', unique: true })
  productId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: Object })
  specs: Record<string, any>;

  @Prop()
  ratingsAvg?: number;

  @Prop()
  reviewsCount?: number;

  @Prop()
  lastScrapedAt: Date;
}

export const ProductDetailSchema =
  SchemaFactory.createForClass(ProductDetail);
