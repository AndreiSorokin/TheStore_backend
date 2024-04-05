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

const OrderSchema = new Schema<OrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
    required: true,
  },
  shipment: {
    type: String,
    required: true,
  },
  priceSum: {
    type: Number,
    required: true,
  },
  orderItems: [OrderItemSchema],
});

export default mongoose.model<OrderDocument>("Orders", OrderSchema);
