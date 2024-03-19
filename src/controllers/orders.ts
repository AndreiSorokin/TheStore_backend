import { Request, Response } from "express";

import ordersService from "../services/orders";
import Order from "../models/Order";

export async function getAllOrders(_: Request, response: Response) {
  const orders = await ordersService.getAllOrders();
  response.status(200).json(orders);
}

export async function createOrder(request: Request, response: Response) {
  const newData = new Order(request.body);
  const newOrder = await ordersService.createOrder(newData);
  response.status(201).json(newOrder);
}

export async function getOrderById(request: Request, response: Response) {
  const foundOrder = await ordersService.getOrderById(request.params.orderId);
  response.status(201).json(foundOrder);
}

export async function updateOrder(request: Request, response: Response) {
  const orderId = request.params.id;
  const newData = new Order(request.body);
  await ordersService.updateOrder(orderId, newData);
  response.sendStatus(204);
}

export async function deleteOrder(request: Request, response: Response) {
    const orderId = request.params.id;
    await ordersService.deleteOrderById(orderId);
    response.sendStatus(204);
  }
  