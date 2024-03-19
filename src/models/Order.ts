import mongoose, { Document, Schema } from "mongoose";
import { Order } from "../misc/types";

export type OrderDocument = Document & Order;

const OrderSchema = new Schema<OrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
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
  orderItems: [
    {
      id: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});

export default mongoose.model<OrderDocument>("Orders", OrderSchema);
