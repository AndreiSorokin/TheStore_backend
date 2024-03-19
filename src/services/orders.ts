import Order, { OrderDocument } from "../models/Order";

const getAllOrders = async (): Promise<OrderDocument[]> => {
  return await Order.find();
  // limit
  // skip
  // {regex: search query}
};

const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  // save
  // 1. create new order
  // 2. return that
  return await order.save();
};

// To do: handle error
const getOrderById = async (id: string): Promise<OrderDocument | undefined> => {
  const foundOrder = await Order.findById(id);
  if (foundOrder) {
    return foundOrder;
  }
};

const deleteOrderById = async (id: string) => {
  const foundOrder = await Order.findByIdAndDelete(id);
  if (foundOrder) {
    return foundOrder;
  }
};

const updateOrder = async (
  id: string,
  newInformation: Partial<OrderDocument>
) => {
  const updatedOrder = await Order.findByIdAndUpdate(id, newInformation, {
    new: true,
  });
  return updatedOrder;
};

export default {
  getAllOrders,
  createOrder,
  getOrderById,
  deleteOrderById,
  updateOrder,
};
