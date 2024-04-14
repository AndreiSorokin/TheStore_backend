import mongoose, { Document, Model } from "mongoose";

import { Cart, OrderItem } from "../misc/types"

const Schema = mongoose.Schema;

export type CartDocument = Document & Cart;

const CartSchema = new Schema({
   id: {
      type: Number,
      required: true
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   priceSum: {
      type: Number,
      required: true
   },
   cartItems: {
      quantity: {
         type: Number,
         required: true,
      },
      productId: {
         type: Schema.Types.ObjectId,
         ref: "Product",
         required: true,
      },
   }
})

CartSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id
   }
})

export default mongoose.model<CartDocument>("User", CartSchema);