import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import { errorHandler } from '../utils/error';

export const test = (req: Request, res: Response) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);

    // Check if user exists
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    //Check if user is updating their own account
    if (req.params.id !== user._id.toString()) {
      return next(errorHandler(401, 'You can only update your own account!'));
    }

    // Check if password is being updated
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // Need to specify which fields to update and avoid hacking
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } // Return the updated document rather than the original document
    );

    const { password, ...rest } = (updatedUser && updatedUser.toObject()) || {};

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
