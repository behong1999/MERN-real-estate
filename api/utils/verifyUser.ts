import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorHandler } from './error';
import { IUser } from './types';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  try {
    if (!token) return next(errorHandler(401, 'Unauthorized'));
    let user: IUser;
    user = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).send('Please authenticate');
  }
};
