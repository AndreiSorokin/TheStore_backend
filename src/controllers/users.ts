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
import { baseUrl } from "../api/baseUrl";
import { loginPayload, UserToRegister } from "../misc/types";

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
    const userId = request.params.id;
    if (!userId) {
      throw new BadRequestError("User Id Needed");
    }
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
  const { username, password, firstName, lastName, email, role, userStatus } =
    request.body;

  try {
    if (!username || !password || !firstName || !lastName || !email) {
      throw new BadRequestError("Fill out all the fields");
    } else if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email");
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role: role || "CUSTOMER",
      status: userStatus || "ACTIVE",
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

export async function updatePassword(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { oldPassword, newPassword } = request.body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError(
        "Please provide both oldPassword and newPassword!"
      );
    }

    const userData = await userService.getSingleUser(request.params.id);

    const hashedPassword = userData.password;

    const isPasswordCorrect = await bcrypt.compare(oldPassword, hashedPassword);

    if (!isPasswordCorrect) {
      throw new BadRequestError("Wrong password");
    }

    const user = await userService.updatePassword(userData, newPassword);
    response.status(201).send(user);
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
    } else if (error instanceof BadRequestError) {
      response.status(400).json({
        message: error.message,
      });
    }

    next(new InternalServerError());
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
export async function googleLogin(request: Request, response: Response) {
  console.log("hello google login");
  try {
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Something went wrong");
  }
}
export async function googleLoginCallback(
  request: Request,
  response: Response
) {
  console.log("inside the google login callback");
  try {
    const user = request.user;
    response.status(200).json({ user });
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Something went wrong");
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

// Todo: Send verification link to user
export async function loginUserForGoogelUser(data: loginPayload) {
  try {
    const { email, password } = data;
    const userData = await userService.getUserByEmail(email);
    const hashedPassword = userData.password;

    const isPasswordCorrect = await bcrypt.hash(
      password.toString(),
      hashedPassword.toString()
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("Wrong password");
    }

    const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { email: userData.email, role: userData.role },
      process.env.JWT_SECRET!,
      { expiresIn: "20d" }
    );

    return { token: token, refreshToken: refreshToken, userData };
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    } else if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError(error.message);
    } else if (error instanceof NotFoundError) {
      throw new NotFoundError(error.message);
    } else {
      throw new InternalServerError("Internal server error");
    }
  }
}
export async function registerUserForGoogelUser(data: UserToRegister) {
  const { username, password, firstName, lastName, email } = data;

  try {
    if (!username || !password || !firstName || !lastName || !email) {
      throw new BadRequestError("Fill out all the fields");
    } else if (!validator.isEmail(email)) {
      throw new BadRequestError("Please enter a valid email");
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role: "CUSTOMER",
      status: "ACTIVE",
    });

    const newUser = (await userService.createUser(user)) as UserDocument;
    const loginUser = await loginUserForGoogelUser({
      email: newUser["email"],
      password: newUser["password"],
    });
    return { loginUser };
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    } else if (error instanceof InternalServerError) {
      throw new InternalServerError("Something went wrong");
    } else {
      throw new InternalServerError("Something went wrong");
    }
  }
}

export async function forgotPassword(request: Request, response: Response) {
  try {
    const { email } = request.body;
    const userData = await userService.getUserByEmail(email);
    const token: string = uuid();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid email address.");
    }

    const verificationLink = `${baseUrl}/reset-password?token=${token}`;
    await userService.sendVerificationEmail(email, verificationLink);

    userData.resetToken = token;
    userData.resetTokenExpiresAt = new Date(Date.now() + 3600000);
    await userData.save();

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

export async function resetPassword(request: Request, response: Response) {
  try {
    const { newPassword } = request.body;
    const token = request.query.token as string;

    if (!newPassword || !token) {
      throw new BadRequestError("Invalid or missing reset token");
    }

    const userData = await userService.getUserByResetToken(token);

    if (!userData.resetTokenExpiresAt) {
      throw new BadRequestError("Missing reset token expired time");
    }

    if (Date.now() > userData.resetTokenExpiresAt.getTime()) {
      throw new BadRequestError("Expired reset token");
    }

    const newUserData = await userService.updatePassword(userData, newPassword);

    response
      .status(200)
      .json({ newUserData, message: "Password reset successful." });
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
      throw new BadRequestError("Missing user ID");
    }
    const updatedRole: UserDocument = await userService.assingAdmin(id, {
      role: role,
    });

    response.status(200).json(updatedRole);
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
      throw new BadRequestError("Missing user ID");
    }
    const updatedRole: UserDocument = await userService.removeAdmin(id, {
      role: role,
    });

    response.status(200).json(updatedRole);
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

export async function updateUserStatus(request: Request, response: Response) {
  const { userId, userStatus } = request.body;

  try {
    if (!userId) {
      throw new BadRequestError("Missing user ID ");
    } else if (!userStatus) {
      throw new BadRequestError("Missing user Status");
    }
    const updatedUserStatus = await userService.updateUserStatus(userId, {
      status: userStatus,
    });
    response.status(200).json(updatedUserStatus);
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
