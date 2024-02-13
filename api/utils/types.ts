import { ObjectId } from "mongoose";

export interface IUser extends Document {
    id: ObjectId;
    username: string;
    email: string;
    password: string;
    avatar: string;
  }