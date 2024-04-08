import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Order, { OrderDocument } from "../models/Order";
import { PipelineStage } from "mongoose";

type CountResult = {
  count: number;
};

type OrderData = {
  orders: OrderDocument[];
  count: number;
};

// const getAllOrders = async (
//   limit: number,
//   skip: number,
//   searchQuery?: string,
//   minPrice?: number,
//   maxPrice?: number
// ): Promise<OrderData> => {
//   const pipeline: PipelineStage[] = [];

//   // Search by userId (case-insensitive)
//   if (searchQuery) {
//     pipeline.push({
//       $match: { userId: { $regex: searchQuery, $options: "i" } },
//     });
//   }

//   // Price range matching
//   if (minPrice !== undefined && maxPrice !== undefined) {
//     pipeline.push({
//       $match: {
//         price: { $gte: minPrice, $lte: maxPrice },
//       },
//     });
//   }

//   // Add sorting and pagination to the pipeline
//   pipeline.push(
//     { $sort: { createdAt: -1 } },
//     { $skip: skip },
//     { $limit: limit }
//   );

//   // Perform the aggregation
//   const countPipeline: PipelineStage[] = [...pipeline]; // Clone the pipeline for counting
//   countPipeline.push({ $count: "count" });
//   const countResult: CountResult[] = await Order.aggregate<CountResult>(
//     countPipeline
//   );

//   const count = countResult.length > 0 ? countResult[0].count : 0;
//   console.log("Pipeline:", JSON.stringify(pipeline));
//   console.log("Count:", count);
//   const data = await Order.aggregate(pipeline);

//   return { orders: data, count };
// };

const getAllOrders = async (): Promise<OrderDocument[]> => {
  return await Order.find();
};

const createOrder = async (
  order: OrderDocument,
  userId: string
): Promise<OrderDocument> => {
  if (!userId || !order) {
    throw new BadRequestError(`Please provide order information and userId!`);
  }

  return await order.save();
};

const getOrderById = async (id: string): Promise<OrderDocument> => {
  if (!id) {
    throw new BadRequestError(`Please provide orderId!`);
  }

  const foundOrder = await Order.findById(id);
  if (foundOrder) {
    return foundOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

const deleteOrderById = async (id: string) => {
  if (!id) {
    throw new BadRequestError(`Please provide orderId!`);
  }

  const foundOrder = await Order.findByIdAndDelete(id);
  if (foundOrder) {
    return foundOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

const updateOrder = async (
  id: string,
  newInformation: Partial<OrderDocument>
) => {
  if (!newInformation || !id) {
    throw new BadRequestError(`Please provide update information and orderId!`);
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, newInformation, {
    new: true,
  });

  if (updatedOrder) {
    return updatedOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

const getAllOrdersByUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  if (!userId) {
    throw new BadRequestError(`Please provide userId!`);
  }
  console.log(userId);
  const orders = await Order.find({ userId: userId });
  if (orders !== null) {
    return orders;
  }

  throw new NotFoundError(`Can not find orders with userId: ${userId}`);
};

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  deleteOrderById,
  updateOrder,
  getAllOrdersByUserId,
};
