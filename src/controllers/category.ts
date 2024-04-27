import { NextFunction, Request, Response } from "express";
import Category from "../models/Category"
import categoryService from "../services/category"
import { CategoryDocument } from "../models/Category";
import { uploadImageToCloudinary } from '../services/uploads';
import { InternalServerError } from "../errors/ApiError";

export async function getAllCategory(_: Request, response: Response, next: NextFunction) {
    try {
        const category = await categoryService.getAllCategory()
        response.status(200).json(category)
    } catch (error) {
        next(new InternalServerError());
    }
}

export async function getOneCategory(request: Request, response: Response, next: NextFunction) {
    try {
        const category = await categoryService.getOneCategory(request.params.id)
        if (!category) {
            return response.status(404).json({ message: "Category not found" });
        }
        response.status(201).json(category)
    } catch (error) {
        next(new InternalServerError());
    }
}

export async function createCategory(request: Request, response: Response, next: NextFunction) {
    try {
        let imageUrl = '';
        if (request.file) {
            const fileBuffer: Buffer = request.file.buffer;
            const fileName: string = request.file.originalname;
            imageUrl = await uploadImageToCloudinary(fileBuffer, fileName);
        }

        const categoryData = {
            ...request.body,
            image: imageUrl
        };
        const category = new Category(categoryData);
        const newCategory = await categoryService.createCategory(category);
        response.status(201).json(newCategory);
    } catch (error) {
        next(new InternalServerError());
    }
}

export async function updateCategory(request: Request, response: Response, next: NextFunction) {
    try {
        const id = request.params.id;
        const category: Partial<CategoryDocument> = request.body;

        const updatedCategory: CategoryDocument | null = await categoryService.updateCategory(id, category);

        if (!updatedCategory) {
            return response.status(404).json({ message: "Category not found" });
        }

        response.status(200).json(updatedCategory);
    } catch (error) {
        next(new InternalServerError());
    }
}

export async function deleteCategory(request: Request, response: Response, next: NextFunction) {
    try {
        const id = request.params.id;
        await categoryService.deleteCategory(id)
        response.status(204).json({ message: "Category has been deleted" }).end()

    } catch (error) {
        next(new InternalServerError());
    }
}