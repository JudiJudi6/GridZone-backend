import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DeskRenderData {
  @Prop() deskPath?: string;
  @Prop() deskName?: string;
  @Prop() equipPath?: string;
  @Prop([String]) equipment?: string[];
  @Prop() id?: string;
  @Prop() rotX?: number;
  @Prop() rotY?: number;
  @Prop() rotZ?: number;
  @Prop() scale?: number;
  @Prop({ enum: ['static', 'desk'] }) type?: 'static' | 'desk';
  @Prop() x?: number;
  @Prop() y?: number;
  @Prop() z?: number;
}

export const DeskRenderDataSchema =
  SchemaFactory.createForClass(DeskRenderData);

@Schema()
export class FloorRenderData {
  @Prop() color?: string;
  @Prop() endX?: number;
  @Prop() endY?: number;
  @Prop() endZ?: number;
  @Prop() id?: string;
  @Prop() x?: number;
  @Prop() y?: number;
  @Prop() z?: number;
}

export const FloorRenderDataSchema =
  SchemaFactory.createForClass(FloorRenderData);

@Schema()
export class ElementRenderData {
  @Prop() id?: string;
  @Prop() path?: string;
  @Prop() rotX?: number;
  @Prop() rotY?: number;
  @Prop() rotZ?: number;
  @Prop() scale?: number;
  @Prop({ enum: ['static', 'desk'] }) type?: 'static' | 'desk';
  @Prop() x?: number;
  @Prop() y?: number;
  @Prop() z?: number;
}

export const ElementRenderDataSchema =
  SchemaFactory.createForClass(ElementRenderData);

@Schema()
export class WallRenderData {
  @Prop() color?: string;
  @Prop() endX?: number;
  @Prop() endY?: number;
  @Prop() endZ?: number;
  @Prop() transparent?: boolean;
  @Prop() id?: string;
  @Prop() x?: number;
  @Prop() y?: number;
  @Prop() z?: number;
}

export const WallRenderDataSchema =
  SchemaFactory.createForClass(WallRenderData);

@Schema()
export class OfficeRenderData {
  @Prop({ type: [DeskRenderDataSchema], required: true })
  desks: DeskRenderData[];

  @Prop({ type: [FloorRenderDataSchema] })
  floor?: FloorRenderData[];

  @Prop({ type: [ElementRenderDataSchema] })
  elements?: ElementRenderData[];

  @Prop({ type: [WallRenderDataSchema] })
  walls?: WallRenderData[];
}

export const OfficeRenderDataSchema =
  SchemaFactory.createForClass(OfficeRenderData);

@Schema()
export class ReservationData {
  @Prop() reservationId?: string;
  @Prop() userId?: string;
  @Prop({ type: Object })
  user?: { name?: string; surname?: string };
  @Prop() startTime?: Date;
  @Prop() endTime?: Date;
  @Prop() createdAt?: Date;
}

export const ReservationDataSchema =
  SchemaFactory.createForClass(ReservationData);

@Schema()
export class Desk {
  @Prop({ required: true }) deskId: string;
  @Prop({ required: true }) deskName: string;
  @Prop([String]) equipment: string[];
  @Prop({ type: [ReservationDataSchema] }) reservationData: ReservationData[];
  @Prop({ default: true }) active: boolean;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);

@Schema()
export class Office {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: OfficeRenderDataSchema, required: true })
  renderData: OfficeRenderData;

  @Prop({ type: [DeskSchema], required: true })
  deskList: Desk[];

  @Prop({ required: true })
  authorId: string;

  @Prop({
    type: [{ name: { type: String }, surname: { type: String } }],
  })
  users: { name: string; surname: string }[];

  @Prop({ required: true })
  invitationCode: string;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
export type OfficeDocument = Office & Document;
