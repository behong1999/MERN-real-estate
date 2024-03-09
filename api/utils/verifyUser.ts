import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError, errorHandler } from './error';
import { IUser } from './types';

// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.cookies.access_token;
//   console.log(token);
//   try {
//     if (!token) return next(errorHandler(401, 'Unauthorized'));
//     let user: IUser;
//     user = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
//     (req as any).user = user;
//     next();
//   } catch (error) {
//     res.status(401).send('Please authenticate');
//   }
// };

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decodedToken) {
      return next(errorHandler(404, 'Forbidden'));
    }
    console.log(decodedToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Please authenticate');
  }
};
