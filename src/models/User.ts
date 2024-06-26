import mongoose, { Document, Model } from "mongoose";

import { Role, User, UserStatus } from "../misc/types";

const Schema = mongoose.Schema;

export type UserDocument = Document & User;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String
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
  status: {
    type: String,
    enum: [UserStatus.ACTIVE, UserStatus.INACTIVE],
    default: UserStatus.ACTIVE,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
});

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id
  }
})

export default mongoose.model<UserDocument>("User", UserSchema);
