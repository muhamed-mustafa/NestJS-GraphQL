import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Book } from 'src/book/book.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AuthorDocument = Author & mongoose.Document;

@Schema()
@ObjectType()
export class Author {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  @Field(() => [Book])
  books: Book[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;
}
