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
import Product from "../models/Product";
import { OrderItem } from "../misc/types";

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
    console.log(request.body)

    const orderItems = request.body.items.map((item: any) => ({
      quantity: item.quantity,
      productId: item.product.id,
      image: item.product.category.image,
    }));
    const data = new Order({
      userId,
      orderItems
    });
    
    const newOrder = await ordersService.createOrder(data, userId);

    console.log('userId', userId)
    console.log('newOrder', newOrder)

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    user.orders?.push(newOrder.id);
    await user.save();

    response.status(201).json(newOrder);
  } catch (error) {
    const userId = request.params.userId;
    console.log('userId', userId)
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
    console.log(error);
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
export async function updateOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.id;
    const newData = new Order(request.body);
    await ordersService.updateOrder(orderId, newData);
    response.sendStatus(204);
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
        message: `Missing  update information or orderId`,
      });
    }

    next(new InternalServerError());
  }
}
export async function deleteOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.id;
    await ordersService.deleteOrderById(orderId);

    response.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: `Cant find order with id ${request.params.orderId}`,
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

export async function getAllOrdersByUserId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId;
    const orders = await ordersService.getAllOrdersByUserId(userId);
    console.log(orders);

    response.status(200).json(orders);
  } catch (error) {
    console.log(error)
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
