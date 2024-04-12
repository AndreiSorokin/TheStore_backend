import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { FilterQuery } from 'mongoose';
import Product from "../models/Product";
import productsService from "../services/products";
import { ProductDocument } from "../models/Product";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../errors/ApiError";
import Category from "../models/Category";
import { uploadImageToCloudinary } from "../services/uploads";

export async function getAllProducts(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const {
            limit = 9,
            offset = 0,
            searchQuery = "",
            minPrice = 0,
            maxPrice = Infinity,
            size,
            gender
        } = request.query;

        const query: FilterQuery<ProductDocument> = {};

        if (minPrice !== undefined && maxPrice !== undefined) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        if (searchQuery) {
            const searchQueryStr = String(searchQuery);
            query.name = { $regex: new RegExp(searchQueryStr, 'i') };
        }

        if(size) {
            query.size = String(size);
        }

        if(gender) {
            query.gender = String(gender);
        }

        const totalProducts = await Product.find(query);
        const totalCount = totalProducts.length;

        const productList = await Product
            .find(query)
            .sort({ price: 1 })
            .populate("category", { name: 1, image: 1 })
            .limit(Number(limit))
            .skip(Number(offset));

        response.status(200).json({ totalCount, products: productList });
    } catch (error) {
        next(new InternalServerError("Internal error"));
    }
}

export async function getOneProduct(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const product = await productsService.getOneProduct(request.params.id);
        response.status(201).json(product);
    } catch (error) {
        if (error instanceof NotFoundError) {
            response.status(404).json({
                message: "Product not found",
            });
        } else if (error instanceof mongoose.Error.CastError) {
            response.status(404).json({
                message: "Product not found",
            });
            return;
        }

        next(new InternalServerError());
    }
}

export async function createProduct(request: Request, response: Response) {
    try {
        const { name, price, description, category, size, gender } = request.body;

        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            throw new BadRequestError("Category not found");
        }

        
        let imageUrls = [];
        if (request.files) {
            const files = request.files as Express.Multer.File[];
            for (const file of files) {
                const imageUrl = await uploadImageToCloudinary(file.buffer, file.originalname);
                imageUrls.push(imageUrl);
            }
        }

        const product = new Product({
            name,
            price,
            description,
            category: categoryDoc._id,
            images: imageUrls,
            size,
            gender
        });
        
        const newProduct = await productsService.createProduct(product);
        response.status(201).json(newProduct);
    } catch (error) {
        if (error instanceof BadRequestError) {
            response.status(400).json({ error: error.message });
        } else {
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export async function updateProduct(request: Request, response: Response) {
    const id = request.params.id;
    const product: Partial<ProductDocument> = request.body;

    try {
        const updatedProduct = await productsService.updateProduct(id, product);
        response.status(200).json(updatedProduct);
    } catch (error) {
        if (error instanceof BadRequestError) {
            response.status(400).json({ error: "Invalid request" });
        } else if (error instanceof NotFoundError) {
            response.status(404).json({ error: "Product not found" });
        } else if (error instanceof mongoose.Error.CastError) {
            response.status(404).json({
                message: "Product not found",
            });
            return;
        } else {
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export async function deleteProduct(request: Request, response: Response) {
    const id = request.params.id;

    try {
        await productsService.deleteProduct(id);
        response.status(204).json({ message: "Product has been deleted" }).end();
    } catch (error) {
        if (error instanceof BadRequestError) {
            response.status(400).json({ error: "Invalid request" });
        } else if (error instanceof NotFoundError) {
            response.status(404).json({ error: "Product not found" });
        } else {
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
}
