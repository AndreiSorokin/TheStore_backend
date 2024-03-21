import mongoose, { Document, Model } from "mongoose";

import { Category } from "../misc/types"

const Schema = mongoose.Schema;

export type CategoryDocument = Document & Category

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})

export default mongoose.model<CategoryDocument>("Category", CategorySchema)