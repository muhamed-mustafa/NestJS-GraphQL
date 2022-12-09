import { omit } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { Ctx } from 'src/types/context.type';
import {
  User,
  UserDocument,
  CreateUserInput,
  ConfirmUserInput,
  LoginInput,
} from './user.schema';
import { signJwt } from '../utils/jwt';
import { CookieOptions } from 'express';

const cookieOptions: CookieOptions = {
  domain: 'localhost',
  secure: false,
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(input: CreateUserInput) {
    const confirmToken = nanoid(10);
    return this.userModel.create({ ...input, confirmToken });
  }

  async confirmUser({ confirmToken, email }: ConfirmUserInput) {
    const user = await this.userModel.findOne({ email });

    if (!user || confirmToken !== user.confirmToken) {
      throw new Error('Email or confirm token are incorrect');
    }

    user.active = true;

    await user.save();

    return user;
  }

  async login({ email, password }: LoginInput, context: Ctx) {
    const user = await this.userModel
      .findOne({ email })
      .select('-__v -confirmToken');

    if (!user || !user.comparePassword(password))
      throw new Error('Invalid email or password');

    if (!user.active) throw new Error('Please confirm your email address');

    const token = signJwt(omit(user.toJSON(), ['password', 'active']));

    context.res.cookie('token', token, cookieOptions);

    return user;
  }

  async logout(context: Ctx) {
    context.res.cookie('token', null, { ...cookieOptions, maxAge: 0 });
    return null;
  }
}
