import mongoose, { Document, Schema } from "mongoose";
import { Order, OrderItem } from "../misc/types";

export type OrderDocument = Document & Order;

export type OrderItemDocument = Document & OrderItem;

const OrderItemSchema = new Schema<OrderItemDocument>({
  quantity: {
    type: Number,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

OrderItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id
  }
})

const OrderSchema = new Schema<OrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  shipment: {
    type: String,
  },
  priceSum: {
    type: Number,
  },
  orderItems: [OrderItemSchema],
});

OrderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id
  }
})

export default mongoose.model<OrderDocument>("Orders", OrderSchema);
