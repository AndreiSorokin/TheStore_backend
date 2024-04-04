import User, { UserDocument } from "../models/User";
import { BadRequestError, NotFoundError } from "../errors/ApiError";

import nodemailer from "nodemailer";
import { Role } from "../misc/types";

const getAllUser = async (): Promise<UserDocument[]> => {
  return await User.find().populate("orders");
};

const getSingleUser = async (id: string): Promise<UserDocument | undefined> => {
  const user = await User.findById(id);
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

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (user) {
    return user;
  }
  throw new NotFoundError();
};

const getUserByEmail = async (email: string): Promise<UserDocument> => {
  if (email === "") {
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
  if (!email) {
    throw new BadRequestError("Please provide your email");
  }

  //  Todo: Create a transporter using SMTP server details
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "lamngo606@gmail.com",
      pass: "nlrpjsxylajeyhnp",
    },
  });

  // Todo: create the email message
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  return await transporter.sendMail(mailOptions);
};

const assingAdmin = async(id: string, updateRole: Partial<UserDocument>) => {
  if (!id) {
    throw new BadRequestError();
  }

  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateRole, options);

  if (!updateUser) {
    throw new BadRequestError();
  }

  return updateUser;
}

const removeAdmin = async(id: string, updateRole: Partial<UserDocument>) => {
  if (!id) {
    throw new BadRequestError();
  }

  const options = { new: true, runValidators: true };
  const updateUser = await User.findByIdAndUpdate(id, updateRole, options);

  if (!updateUser) {
    throw new BadRequestError();
  }
  return updateUser;
}
const updateUserStatus = async(userId: string,status: Partial<UserDocument>) => {
  
  if (!userId) {
    throw new BadRequestError();
  }else if (!status){
    throw new BadRequestError();
  }

  const options = { new: true, runValidators: true };
  const updateUserStatus = await User.findByIdAndUpdate(userId, status, options);

  if (!updateUserStatus) {
    throw new BadRequestError();
  }
  return updateUserStatus;
}


export default {
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  sendVerificationEmail,
  assingAdmin,
  removeAdmin,
  updateUserStatus,
};
