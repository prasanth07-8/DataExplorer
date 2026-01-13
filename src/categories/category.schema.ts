import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Navigation', required: true })
  navigationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentId?: Types.ObjectId | null;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, lowercase: true })
  slug: string;

  @Prop({ default: 0 })
  productCount: number;

  @Prop()
  lastScrapedAt?: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ navigationId: 1 });
CategorySchema.index({ parentId: 1 });
