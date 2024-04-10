import mongoose, { Document, Model } from "mongoose";

import { Product, Size } from "../misc/types"

const Schema = mongoose.Schema;

export type ProductDocument = Document & Product

const ProductSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      min: 0,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
   },
   images: {
      type: [String],
      required: true
   },
   size: {
      type: String,
      enum: [Size.Small, Size.Medium, Size.Large],
      required: true
   },
})

ProductSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id
   }
})

ProductSchema.index({ name: "text" })

export default mongoose.model<ProductDocument>("Products", ProductSchema)