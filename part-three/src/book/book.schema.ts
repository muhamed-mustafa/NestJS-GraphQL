import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Author } from 'src/author/author.schema';

export type BookDocument = Book & mongoose.Document;

@Schema()
@ObjectType()
export class Book {
  @Field(() => ID)
  _id: number;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ required: true })
  @Field()
  isbn: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Author.name })
  @Field(() => Author)
  author: Author | number;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index({ author: 1 });

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  isbn: string;

  @Field()
  author: string;
}

@InputType()
export class FindBookInput {
  @Field()
  _id: string;
}
