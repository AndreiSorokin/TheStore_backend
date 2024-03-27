import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import validator from "validator";

import userService from "../services/user";
import User, { UserDocument } from "../models/User";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError, UnauthorizedError,
} from "../errors/ApiError";

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
  const { username, password, firstName, lastName, email, role } = request.body

  if (!username || !password || !firstName || !lastName || !email) {
    throw new BadRequestError("Fill out all the fields")
  } else if (!validator.isEmail(email)) {
    throw new BadRequestError("Please Enter a valid email")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({
    username: username,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role || 'CUSTOMER'
  })

  try {
    const newUser = await userService.createUser(user)
    response.status(201).json({ newUser })
  } catch (error) {
    throw new InternalServerError("Something went wrong")
  }
}

export async function updateUser(request: Request, response: Response) {
  const id = request.params.id;
  // const user: Partial<UserDocument> = request.body;
  const { firstName, lastName, email } = request.body

  try {
    const updateUser: UserDocument | null = await userService.updateUser(
      id,
      { firstName, lastName, email }
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

// ToDo: fix deletion
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


export async function loginUser(request: Request, response: Response) {
  try {
    const { email, password } = request.body
    const userData = await userService.getUserByEmail(email);
    const hashedPassword = userData.password
    
    const isPasswordCorrect = await bcrypt.compare(password.toString(), hashedPassword.toString())

    if(!isPasswordCorrect) {
      throw new BadRequestError('Wrong password')
    }

    const token = jwt.sign({ email: userData.email }, process.env.SECRET_KEY!, { expiresIn: '1h' })

    const refreshToken = jwt.sign({ email: userData.email }, process.env.SECRET_KEY!, { expiresIn: '20d' })

    response.status(200).json({ token: token, refreshToken: refreshToken, userData } );

  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: error.message,
      });
    } else if (error instanceof UnauthorizedError) {
      response.status(401).json({
        message: error.message,
      });
    } else if(error instanceof NotFoundError) {
      response.status(404).json({
        message: error.message,
      });
    } else {
      response.status(500).json({
        message: "Internal server error",
      });
    }

  }
}
