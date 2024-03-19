import { Request, Response } from "express";
import Category from "../models/Category"
import categoryService from "../services/category"
import { CategoryDocument } from "../models/Category";

export async function getAllCategory(_: Request, response: Response) {
    const category = await categoryService.getAllCategory()
    response.status(200).json(category)
}

export async function getOneCategory(request: Request, response: Response) {
    const category = await categoryService.getOneCategory(request.params.id)
    if (!category) {
        return response.status(404).json({ message: "Category not found" });
    }
    response.status(201).json(category)
}

export async function createCategory(request: Request, response: Response) {
    const category = new Category(request.body)
    const newCategory = await categoryService.createCategory(category)
    response.status(201).json(newCategory);
}

export async function updateCategory(request: Request, response: Response) {
    const id = request.params.id;
    const category: Partial<CategoryDocument> = request.body;

    const updatedCategory: CategoryDocument | null = await categoryService.updateCategory(id, category);

    if (!updatedCategory) {
        return response.status(404).json({ message: "Category not found" });
    }

    response.status(200).json(updatedCategory);
}

export async function deleteCategory(request: Request, response: Response) {
    const id = request.params.id;
    const category = await categoryService.deleteCategory(id)
    response.status(204).json({ message: "Category has been deleted" }).end()
}