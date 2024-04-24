import User, { UserDocument } from "../models/User";
import { ApiError, BadRequestError, NotFoundError } from "../errors/ApiError";
import bcrypt from "bcrypt";

import nodemailer from "nodemailer";


const getAllUser = async (): Promise<UserDocument[]> => {
  return await User.find().populate("orders");
};

const getSingleUser = async (id: string): Promise<UserDocument> => {
  if (!id) {
    throw new BadRequestError();
  }
  const user = await User.findById(id).populate("cart")
  if (user) {
    return user;
  }
  throw new NotFoundError();
};

const createUser = async (
  user: UserDocument
): Promise<UserDocument | string> => {
  const { email } = user;

  const isEmailAlreadyAdded = await User.findOne({ email });

  if (isEmailAlreadyAdded) {
    return "Email already added in our database";
  }

  return await user.save();
};

const updateUser = async (id: string, updateData: Partial<UserDocument>) => {
  if (!id) {
    throw new BadRequestError();
  }
  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateData, options);

  if (!updateUser) {
    throw new BadRequestError();
  }
  return updateUser;
};

const updatePassword = async (
  user: UserDocument,
  newPassword: string
): Promise<UserDocument> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiresAt = null;

  await user.save();

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (user) {
    return user;
  }
  throw new NotFoundError();
};

const getUserByEmail = async (email: string): Promise<UserDocument> => {
  if (!email) {
    throw new BadRequestError(`Please input data properly`);
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new NotFoundError(`User Not Found`);
  }

  return user;
};

const sendVerificationEmail = async (
  email: string,
  verificationLink: string
): Promise<any> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  return await transporter.sendMail(mailOptions);
};

const getUserByResetToken = async (
  resetToken: string
): Promise<UserDocument> => {
  if (!resetToken) {
    throw new BadRequestError(`Please provide resetToken`);
  }
  const user = await User.findOne({ resetToken });

  if (!user) {
    throw new NotFoundError(`User Not Found`);
  }

  return user;
};

const assingAdmin = async (id: string, updateRole: Partial<UserDocument>) => {
  if (!id) {
    throw new BadRequestError();
  }

  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateRole, options);

  if (!updateUser) {
    throw new BadRequestError();
  }

  return updateUser;
};

const removeAdmin = async (id: string, updateRole: Partial<UserDocument>) => {
  if (!id) {
    throw new BadRequestError();
  }

  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateRole, options);

  if (!updateUser) {
    throw new BadRequestError();
  }
  return updateUser;
};

const updateUserStatus = async (userId: string, status: string) => {
  const options = { new: true, runValidators: true };
  const user = await User.findByIdAndUpdate(userId, { status }, options);

  if (!user) {
    throw new NotFoundError(`User Not Found with ${userId}`);
  }

  return user;
};

const findOrCreate = async (payload: Partial<UserDocument>) => {
  if (!payload.email) {
    throw new BadRequestError("Something went wrong");
  }
  const result = await User.findOne({ email: payload.email });
  if (result) {
    return result;
  } else {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const user = new User({
      email: payload.email,
      password: hashedPassword,
      username: "username",
      firstName: "",
      lastName: "",
    });
    console.log('payload',payload)
    const emailContent = `Welcome! Your account has been created successfully. Here is your password: ${randomPassword}. Please change it upon your first login for security reasons.`;

    await sendVerificationEmail(payload.email, emailContent);
    const createdUser = await user.save();
    return createdUser;
  }
};

export default {
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  sendVerificationEmail,
  updatePassword,
  getUserByResetToken,
  assingAdmin,
  removeAdmin,
  updateUserStatus,
  findOrCreate
};
