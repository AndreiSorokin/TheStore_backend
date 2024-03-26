import User, { UserDocument } from "../models/User";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Order from "../models/Order";

const getAllUser = async (): Promise<UserDocument[]> => {
  return await User.find();
};

const getSingleUser = async (id: string): Promise<UserDocument | undefined> => {
  const user = await User.findById(id);
  if (user) {
    return user;
  }
  throw new NotFoundError();
};

const createUser = async (user: UserDocument): Promise<UserDocument | string> => {
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

const getAllOrdersByUserId = async (userId: string) => {
  if (!userId) {
    throw new BadRequestError(`Please provide userId!`);
  }
  return await Order.find({ userId: userId });
};

const getUserByEmail = async (email: string): Promise<UserDocument> => {
  if(email===""){
    throw new BadRequestError(`Please input data properly`);
  }
  const user = await User.findOne({ email: email });

  if(!user){
      throw new NotFoundError(`User Not Found`);
  }

  return user;
};


export default {
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllOrdersByUserId,
  getUserByEmail,
};
