import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import { errorHandler } from '../utils/error';
import ListingModel from '../models/listing.model';

export const test = (req: Request, res: Response) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password: pass, ...rest } = user.toObject();

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    // Check if user exists
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    // Check if user is updating their own account
    if (user.id != userId) {
      return next(errorHandler(401, 'You can only update your own account!'));
    }

    // Hash the password if it's being updated or provided
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(500, 'Failed to update user'));
    }

    const { password, ...rest } = updatedUser && updatedUser.toObject();

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    // Cannot set headers after the response has been sent
    // Clear cookie first
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user.id === req.params.id) {
    try {
      const listings = await ListingModel.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};
