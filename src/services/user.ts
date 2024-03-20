import Category, { CategoryDocument } from "../models/Category"
import User, { UserDocument } from "../models/User"


const getAllUser = async(): Promise<UserDocument[]> => {
    return await User.find()

 }

const getSingleUser = async (id: string): Promise<UserDocument | undefined> => {
    const user = await User.findById(id)
    if (user) {
        return user;
    }
}

const createUser = async (user: UserDocument): Promise<UserDocument | String> => {
    const { name, email, password, role } = user;
      if (!name || !email || !password || !role) {
         return "Fill out all the fields";
        
      }
    return await user.save();
}

const updateUser = async (id: string, changedCategory: Partial<UserDocument>) => {
    const options = { new: true, runValidators: true }; // Enable validators
    const updatedCategory = await Category.findByIdAndUpdate(id, changedCategory, options);
    return updatedCategory;
}

const deleteUser = async (id: string) => {
    const category = await Category.findByIdAndDelete(id)
    if (category) {
        return category;
    }
}

export default { getAllUser, getSingleUser, createUser, updateUser, deleteUser }