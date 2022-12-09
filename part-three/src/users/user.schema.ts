import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ID, Field, InputType, ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: number;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmToken: string;

  @Prop({ required: true, default: false })
  active: boolean;

  comparePassword: (candidatePassword: string) => boolean;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });

UserSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(user.password, salt);

    user.password = hashPassword;

    return next();
  }

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  let user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((err) => false);
};

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ConfirmUserInput {
  @Field()
  email: string;

  @Field()
  confirmToken: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
