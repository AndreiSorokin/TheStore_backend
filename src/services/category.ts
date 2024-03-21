import Category, { CategoryDocument } from "../models/Category"

const getAllCategory = async (): Promise<CategoryDocument[]> => {
    try {
        return await Category.find();
    } catch (error) {
        console.error("Error fetching categories:", error);
        // Check the type of error and return appropriate response
        if (error instanceof Error) {
            throw new Error("Failed to fetch categories: " + error.message);
        } else {
            throw new Error("Failed to fetch categories: Unknown error");
        }
    }
};

const getOneCategory = async (id: string): Promise<CategoryDocument | undefined> => {
    try {
        const category = await Category.findById(id)
        if (category) {
            return category;
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        if (error instanceof Error) {
            throw new Error("Failed to fetch categories: " + error.message);
        } else {
            throw new Error("Failed to fetch categories: Unknown error");
        }
    }
}

const createCategory = async (category: CategoryDocument): Promise<CategoryDocument> => {
    try {
        const { name, image } = category;
        // Check if the required field "name" is provided
        if (!name || !image) {
            throw new Error("Fill out all the fields");
        }
        return await category.save();
    } catch (error) {
        console.error("Error creating categories:", error);
        if (error instanceof Error) {
            throw new Error("Failed to create categories: " + error.message);
        } else {
            throw new Error("Failed to create categories: Unknown error");
        }
    }
};

const updateCategory = async (id: string, changedCategory: Partial<CategoryDocument>) => {
    try {
        const options = { new: true, runValidators: true }; // Enable validators
        const updatedCategory = await Category.findByIdAndUpdate(id, changedCategory, options);
        return updatedCategory;
    } catch (error) {
        console.error("Error updating categories:", error);
        if (error instanceof Error) {
            throw new Error("Failed to update categories: " + error.message);
        } else {
            throw new Error("Failed to update categories: Unknown error");
        }
    }
}

const deleteCategory = async (id: string) => {
    try {
        const category = await Category.findByIdAndDelete(id)
        if (category) {
            return category;
        }
    } catch (error) {
        console.error("Error deleting categories:", error);
        if (error instanceof Error) {
            throw new Error("Failed to delete categories: " + error.message);
        } else {
            throw new Error("Failed to delete categories: Unknown error");
        }
    }
}

export default { getAllCategory, getOneCategory, createCategory, updateCategory, deleteCategory }