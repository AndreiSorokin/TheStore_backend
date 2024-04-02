import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Order, { OrderDocument } from "../models/Order";

const getAllOrders = async (): Promise<OrderDocument[]> => {
  return await Order.find();
  // limit
  // skip
  // {regex: search query}
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

const getAllOrdersByUserId = async (userId: string) => {
  if (!userId) {
    throw new BadRequestError(`Please provide userId!`);
  }
  return await Order.find({ userId: userId });
};

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  deleteOrderById,
  updateOrder,
  getAllOrdersByUserId,
};
