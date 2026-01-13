import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ViewHistory extends Document {
  @Prop()
  userId?: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ type: Object, required: true })
  pathJson: any;
}

export const ViewHistorySchema = SchemaFactory.createForClass(ViewHistory);

ViewHistorySchema.index({ sessionId: 1 });
ViewHistorySchema.index({ createdAt: -1 });
