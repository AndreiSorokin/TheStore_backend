import validator from "validator";
import Category, { CategoryDocument } from "../models/Category";
import User, { UserDocument } from "../models/User";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors/ApiError";
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

const createUser = async (
  user: UserDocument
): Promise<UserDocument | String> => {
  const { name, email, password, role } = user;

  if (!name || !email || !password || !role) {
    return "Fill out all the fields";
  } else if (!validator.isEmail) {
    return "Please Enter a valid email";
  }
  // check is the eamil already added or not
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

const getUserinfo = async (email: string,pass:String) => {
  if(email==="" || pass===""){
    throw new BadRequestError(`Please input data properly `);
  }
  var user= await User.findOne({ email: email });
  if(!user){
    throw new BadRequestError(`User Not Found`);
  }else{
    if(user["password"]===pass){
      return user;
    }else{
      throw new UnauthorizedError("Wrong Email & Password")
    }
  }
};


export default {
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllOrdersByUserId,
  getUserinfo,
};
