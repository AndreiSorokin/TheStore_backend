import { Request, Response } from "express";
import Category from "../models/Category"
import categoryService from "../services/category"
import { CategoryDocument } from "../models/Category";

export async function getAllCategory(_: Request, response: Response) {
    try {
        const category = await categoryService.getAllCategory()
        response.status(200).json(category)
    } catch (error) {
        console.error('Error fetching category:', error);
        response.status(500).json({ message: 'Internal Server Error. ' + error });
    }
}

export async function getOneCategory(request: Request, response: Response) {
    try {
        const category = await categoryService.getOneCategory(request.params.id)
        if (!category) {
            return response.status(404).json({ message: "Category not found" });
        }
        response.status(201).json(category)
    } catch (error) {
        console.error('Error fetching category:', error);
        response.status(500).json({ message: 'Internal Server Error. ' + error });
    }
}

export async function createCategory(request: Request, response: Response) {
    try {
        const category = new Category(request.body);
        const newCategory = await categoryService.createCategory(category);
        response.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        response.status(500).json({ message: 'Internal Server Error. ' + error });
    }
}

export async function updateCategory(request: Request, response: Response) {
    try {
        const id = request.params.id;
        const category: Partial<CategoryDocument> = request.body;

        const updatedCategory: CategoryDocument | null = await categoryService.updateCategory(id, category);

        if (!updatedCategory) {
            return response.status(404).json({ message: "Category not found" });
        }

        response.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        response.status(500).json({ message: 'Internal Server Error. ' + error });
    }
}

export async function deleteCategory(request: Request, response: Response) {
    try {
        const id = request.params.id;
        await categoryService.deleteCategory(id)
        response.status(204).json({ message: "Category has been deleted" }).end()

    } catch (error) {
        console.error('Error deleting category:', error);
        response.status(500).json({ message: 'Internal Server Error. ' + error });
    }
}