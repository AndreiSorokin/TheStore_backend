import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

import { Request, Response } from "express";
import Category from "../models/Category"
import categoryService from "../services/category"
import { CategoryDocument } from "../models/Category";


const upload = multer({ storage: multer.memoryStorage() });

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
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
async function uploadImageToCloudinary(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileBuffer.toString('base64')}`, {
            folder: "TheStore",
            public_id: fileName,
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
}

export async function createCategory(request: Request, response: Response) {
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