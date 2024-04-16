import mongoose, { Document, Model } from "mongoose";

import { Cart } from "../misc/types"

const Schema = mongoose.Schema;

export type CartDocument = Document & Cart;

const CartSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   priceSum: {
      type: Number,
      required: true,
      default: 0
   },
   cartItems: [{
      productId: {
         type: Schema.Types.ObjectId,
         ref: "Products",
         required: true,
      },
      quantity: {
         type: Number,
         required: true,
         min: 1
      },
   }]
}, {
   timestamps: true
})

CartSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id
   }
})

export default mongoose.model<CartDocument>("Cart", CartSchema);