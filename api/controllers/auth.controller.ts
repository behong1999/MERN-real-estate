import UserModel from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new UserModel({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User Created Successfully!');
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const validUser = await UserModel.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User Not Found!'));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET as string
    );
    const { password: pass, ...rest } = validUser.toObject();
    // Avoid cross-site scripting attacks
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string
      );
      const { password: pass, ...rest } = user.toObject();
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      /*
        36 means base-36 characters including a-z, A-Z, 0-9
        Generate Random 16-characters Password
      */
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new UserModel({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET as string
      );
      const { password, ...rest } = newUser.toObject();
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
