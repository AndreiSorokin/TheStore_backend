import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { v4 as uuid } from "uuid";

import userService from "../services/user";
import User, { UserDocument } from "../models/User";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
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
        message: "Wrong format id",
      });
      return;
    }

    next(new InternalServerError());
  }
}

export async function createUser(request: Request, response: Response) {
  const { username, password, firstName, lastName, email, role } = request.body;

  try {
    if (!username || !password || !firstName || !lastName || !email) {
      throw new BadRequestError("Fill out all the fields");
    } else if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role: role || "CUSTOMER",
    });

    const newUser = await userService.createUser(user);

    response.status(201).json({ newUser });
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({ error: error.message });
    } else if (error instanceof InternalServerError) {
      response.status(500).json({ error: "Something went wrong" });
    } else {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function updateUser(request: Request, response: Response) {
  const id = request.params.id;
  const { firstName, lastName, email } = request.body;

  try {
    const updateUser: UserDocument | null = await userService.updateUser(id, {
      firstName,
      lastName,
      email,
    });
    response.status(200).json(updateUser);
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({ error: "Invalid request" });
    } else if (error instanceof NotFoundError) {
      response.status(404).json({ error: "User not found" });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(404).json({
        message: "Wrong format id",
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

export async function loginUser(request: Request, response: Response) {
  try {
    const { email, password } = request.body;
    const userData = await userService.getUserByEmail(email);
    const hashedPassword = userData.password;

    const isPasswordCorrect = await bcrypt.compare(
      password.toString(),
      hashedPassword.toString()
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("Wrong password");
    }

    const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    console.log("role in controllers", userData.role);

    const refreshToken = jwt.sign(
      { email: userData.email, role: userData.role },
      process.env.JWT_SECRET!,
      { expiresIn: "20d" }
    );

    response
      .status(200)
      .json({ token: token, refreshToken: refreshToken, userData });
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: error.message,
      });
    } else if (error instanceof UnauthorizedError) {
      response.status(401).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
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

export async function forgotPassword(request: Request, response: Response) {
  try {
    const { email } = request.body;
    const userData = await userService.getUserByEmail(email);
    const code: string = uuid();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid email address.");
    }

    const verificationLink = `localhost:8080/verify?code=${code}`;

    await userService.sendVerificationEmail(email, verificationLink);

    response
      .status(200)
      .json({ message: "Verification email sent successfully." });
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      response.status(404).json({
        message: error.message,
      });
    } else {
      response.status(500).json({
        message: "Failed to send verification email.",
      });
    }
  }
}

export async function assingAdmin(request: Request, response: Response) {
  const id = request.params.id;
  const { role } = request.body;

  try {
    if (!id) {
      throw new BadRequestError('Missing user ID');
    }
    const updatedRole: UserDocument = await userService.assingAdmin(id, { role: role })

    response.status(200).json(updatedRole)
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({ error: "Invalid request" });
    } else if (error instanceof NotFoundError) {
      response.status(404).json({ error: "User not found" });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(400).json({
        message: "Wrong id",
      });
      return;
    } else {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function removeAdmin(request: Request, response: Response) {
  const id = request.params.id;
  const { role } = request.body;

  try {
    if (!id) {
      throw new BadRequestError('Missing user ID');
    }
    const updatedRole: UserDocument = await userService.removeAdmin(id, { role: role })

    response.status(200).json(updatedRole)
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status(400).json({ error: "Invalid request" });
    } else if (error instanceof NotFoundError) {
      response.status(404).json({ error: "User not found" });
    } else if (error instanceof mongoose.Error.CastError) {
      response.status(400).json({
        message: "Wrong id",
      });
      return;
    } else {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
