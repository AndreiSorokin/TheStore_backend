import { NextFunction, Request, Response } from "express";

import ordersService from "../services/orders";
import Order from "../models/Order";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/ApiError";
import mongoose from "mongoose";
import User from "../models/User";

export async function getAllOrders(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orders = await ordersService.getAllOrders();
    response.status(200).json(orders);
  } catch (error) {
    next(new InternalServerError());
  }
}
export async function createOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId;
    if (!userId) {
      throw new NotFoundError("Missing userId!");
    }

    const orderItems = request.body.items.map((item: any) => ({
      quantity: item.quantity,
      productId: item.productId.id,
      image: item.productId.category.image,
    }));
    const data = new Order({
      userId,
      orderItems
    });
    
    const newOrder = await ordersService.createOrder(data, userId);

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    user.orders?.push(newOrder.id);
    await user.save();

    response.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing order information or userId!`,
      });
      return;
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong user id format",
      });
    }
    next(new InternalServerError());
  }
}
export async function getOrderById(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const foundOrder = await ordersService.getOrderById(request.params.orderId);
    response.status(200).json(foundOrder);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: `Cant find order with id ${request.params.orderId}`,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong id format",
      });
      return;
    } else if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing orderId`,
      });
    }
    next(new InternalServerError());
  }
}
export async function getAllOrdersByUserId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId;
    const orders = await ordersService.getAllOrdersByUserId(userId);

    response.status(200).json(orders);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: `Can not find orders with userId: ${request.params.userId}`,
      });
      return;
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong id format",
      });
      return;
    } else if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing orderId`,
      });
      return;
    }
    next(new InternalServerError());
  }
}
