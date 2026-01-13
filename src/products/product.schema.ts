import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  sourceId: string; // from World of Books

  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  author?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'GBP' })
  currency: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true, unique: true })
  sourceUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop()
  lastScrapedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ sourceId: 1 }, { unique: true });
ProductSchema.index({ sourceUrl: 1 }, { unique: true });
ProductSchema.index({ lastScrapedAt: 1 });
