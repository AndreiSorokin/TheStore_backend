import Category, { CategoryDocument } from "../models/Category"

const getAllCategory = async (): Promise<CategoryDocument[]> => {
    return await Category.find().populate("products", { name: 1})
    //add pagination and filtering by name, categories, variants.
}

const getOneCategory = async (id: string): Promise<CategoryDocument | undefined> => {
    const category = await Category.findById(id)
    if (category) {
        return category;
    }
}

const createCategory = async (category: CategoryDocument): Promise<CategoryDocument> => {
    const { name } = category;
    if (!name) {
        throw new Error("Fill out all the fields");
    }

    return await category.save();
}

const updateCategory = async (id: string, changedCategory: Partial<CategoryDocument>) => {
    const options = { new: true, runValidators: true }; // Enable validators
    const updatedCategory = await Category.findByIdAndUpdate(id, changedCategory, options);
    return updatedCategory;
}

const deleteCategory = async (id: string) => {
    const category = await Category.findByIdAndDelete(id)
    if (category) {
        return category;
    }
}

export default { getAllCategory, getOneCategory, createCategory, updateCategory, deleteCategory }