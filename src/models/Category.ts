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
    }
})

CategorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id
    }
})

export default mongoose.model<CategoryDocument>("Category", CategorySchema)