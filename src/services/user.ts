import validator from "validator"
import Category, { CategoryDocument } from "../models/Category"
import User, { UserDocument } from "../models/User"
import { BadRequestError, NotFoundError } from "../errors/ApiError"



const getAllUser = async(): Promise<UserDocument[]> => {
    return await User.find()

 }

const getSingleUser = async (id: string): Promise<UserDocument | undefined> => {
    const user = await User.findById(id)
    if (user) {
        return user;
    }
    throw new NotFoundError();
}

const createUser = async (user: UserDocument): Promise<UserDocument | String> => {
    const { name, email, password, role } = user;
   
      if (!name || !email || !password || !role) {
         return "Fill out all the fields";
        
      }else if (!validator.isEmail){
        return "Please Enter a valid email"
      }
      // check is the eamil already added or not
      const isEmailAlreadyAdded=await User.findOne({email});
      if (isEmailAlreadyAdded){
        return "Email already added in our database"
      }
    return await user.save();
}

const updateUser = async (id: string, updateData: Partial<UserDocument>) => {
    
    if(!id) {
        throw new BadRequestError();
    }
    const options = { new: true, runValidators: true }; 
    const updateUser = await User.findByIdAndUpdate(id, updateData, options);
    
    if(!updateUser) {
        throw new BadRequestError();
     }
    return updateUser;
}

const deleteUser = async (id: string) => {
    const user = await User.findByIdAndDelete(id)
    if (user) {
        return user;
    }
    throw new NotFoundError();
}

export default { getAllUser, getSingleUser, createUser, updateUser, deleteUser }