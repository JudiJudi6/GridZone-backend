import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Office } from './office.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    default: new mongoose.Types.ObjectId(),
  })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Office' })
  offices: Office[];

  @Prop({ default: `${process.env.BACKEND_URL}/default-user.png` })
  avatarUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
