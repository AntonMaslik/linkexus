import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LinkDocument = HydratedDocument<Link>;

@Schema()
export class Link {
  @Prop()
  shorten: string;

  @Prop()
  full: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
