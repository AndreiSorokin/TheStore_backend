import { NextFunction, Request, Response } from "express";
import userService from "../services/user";
import User, { UserDocument } from "../models/User";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError, UnauthorizedError,
} from "../errors/ApiError";
import mongoose from "mongoose";

export async function getAllUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const users = await userService.getAllUser();
    if (users.length === 0) {
      return response.status(404).json({ message: "Empty User List" });
    } else {
      response.status(200).json(users);
    }
  } catch (error) {
    next(new InternalServerError("Internal error"));
  }
}

export async function getSingleUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getSingleUser(request.params.id);
    response.status(201).json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({
        message: "User not found",
      });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "User not found",
      });
      return;
    }

    next(new InternalServerError());
  }
}

export async function createUser(request: Request, response: Response) {
  const data = await userService.createUser(new User(request.body));
  if (typeof data === "string") {
    return response.status(404).json({ message: data });
  }
  response.status(201).json(data);
}

export async function updateUser(request: Request, response: Response) {
  const id = request.params.id;
  const user: Partial<UserDocument> = request.body;

  try {
    const updateUser: UserDocument | null = await userService.updateUser(
      id,
      user
    );
    response.status(200).json(updateUser);
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({ error: "Invalid request" });
    } else if (error instanceof NotFoundError) {
      response.status(404).json({ error: "User not found" });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "User not found",
      });
      return;
    } else {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function deleteUser(request: Request, response: Response) {
  const id = request.params.id;

  try {
    const data = await userService.deleteUser(id);
    response.status(204).json({ message: "User has been deleted" }).end();
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({ error: "Invalid request" });
    } else if (error instanceof NotFoundError) {
      response.status(404).json({ error: "User not found" });
    } else {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// Todo: Fetching all orders by user
export async function getAllOrdersByUserId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId;
    const orders = await userService.getAllOrdersByUserId(userId);

    response.status(200).json(orders);
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: `Missing userId`,
      });
    }

    next(new InternalServerError());
  }
}

// Todo: Login User

/*{
  "email":"xyz@gmail.com",
    "password":"123546"

}*/
export async function loginUser(
    request: Request,
    response: Response,
    next: NextFunction
) {

  try {
    const login_data = request.body;
    const user = await userService.getUserinfo(login_data["email"],login_data["password"]);
    response.status(200).json(user);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      response.status(400).json({
        message: error.message,
      });
    }

  }
}
