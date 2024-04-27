import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Order, { OrderDocument } from "../models/Order";


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

  const foundOrder = await Order.findById(id).populate('orderItems.productId');
  if (foundOrder) {
    return foundOrder;
  }

  throw new NotFoundError(`Can not find order with ${id}`);
};

const getAllOrdersByUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  if (!userId) {
    throw new BadRequestError(`Please provide userId!`);
  }
  const orders = await Order.find({ userId: userId }).populate({
    path: 'orderItems.productId',
    select: 'images name price size gender',
  });
  if (orders !== null) {
    return orders;
  }

  throw new NotFoundError(`Can not find orders with userId: ${userId}`);
};

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  getAllOrdersByUserId,
};
