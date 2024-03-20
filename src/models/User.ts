import mongoose, { Document, Model } from "mongoose";
import { User } from "../misc/types";

const Schema = mongoose.Schema;

export type UserDocument = Document & User

const UserSchema = new Schema({
   id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    
    },
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   role: {
      type: String,
      ref: "Role"
   },
   
})

export default mongoose.model<UserDocument>("User", UserSchema)