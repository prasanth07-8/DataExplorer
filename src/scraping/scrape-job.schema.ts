import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ScrapeStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  DONE = 'done',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class ScrapeJob extends Document {
  @Prop({ required: true })
  targetUrl: string;

  @Prop({ required: true })
  targetType: 'navigation' | 'category' | 'product';

  @Prop({ enum: ScrapeStatus, default: ScrapeStatus.PENDING })
  status: ScrapeStatus;

  @Prop()
  startedAt?: Date;

  @Prop()
  finishedAt?: Date;

  @Prop()
  errorLog?: string;
}

export const ScrapeJobSchema = SchemaFactory.createForClass(ScrapeJob);

ScrapeJobSchema.index({ targetUrl: 1 });
ScrapeJobSchema.index({ status: 1 });
