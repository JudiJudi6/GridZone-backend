import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type OfficeDocument = HydratedDocument<Office>;

@Schema()
export class Office {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  workers: User[];

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, default: true })
  createdAt: Date;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
