import { Request, Response } from 'express';
import { User } from 'src/users/user.schema';

export type Ctx = {
  req: Request & { user?: Pick<User, 'email' | 'name'> };
  res: Response;
};
