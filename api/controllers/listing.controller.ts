import { NextFunction, Request, Response } from 'express';
import ListingModel from '../models/listing.model';

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await ListingModel.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
