import mongoose, { Document, Model } from "mongoose";
import { Category } from "../misc/types"

const Schema = mongoose.Schema;

export type CategoryDocument = Document & Category

const CategorySchema = new Schema({
    userId: {
        type: String,
        required: true
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
        required: true
    }
})

export default mongoose.model<CategoryDocument>("Category", CategorySchema)