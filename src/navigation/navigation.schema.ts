import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Navigation extends Document {
  @Prop({ required: true, unique: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop()
  lastScrapedAt?: Date;
}

export const NavigationSchema = SchemaFactory.createForClass(Navigation);

NavigationSchema.index({ slug: 1 }, { unique: true });
NavigationSchema.index({ lastScrapedAt: 1 });
