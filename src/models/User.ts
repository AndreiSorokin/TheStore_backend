import mongoose, { Document, Model } from "mongoose";

import { Role, User } from "../misc/types";

const Schema = mongoose.Schema;

export type UserDocument = Document & User;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiresAt: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: [Role.ADMIN, Role.CUSTOMER],
    default: Role.CUSTOMER,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
});

export default mongoose.model<UserDocument>("User", UserSchema);
