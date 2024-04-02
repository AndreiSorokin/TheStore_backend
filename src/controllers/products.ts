import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Product from "../models/Product";
import productsService from "../services/products";
import { ProductDocument } from "../models/Product";
import { User } from "../misc/types";
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
} from "../errors/ApiError";
import Category from "../models/Category";

export async function getAllProducts(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const {
            limit = 10,
            offset = 0,
            searchQuery = "",
            minPrice = 0,
            maxPrice = Infinity,
        } = request.query;

        const productList = await productsService.getAllProducts(
            Number(limit),
            Number(offset),
            searchQuery as string,
            !isNaN(Number(minPrice)) ? Number(minPrice) : 0,
            !isNaN(Number(maxPrice)) ? Number(maxPrice) : Infinity
        );

        const count = productList.length;
        response.status(200).json({ totalCount: count, products: productList });
    } catch (error) {
        console.log("error", error);
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
        const { name, price, description, category, image, size } = request.body;

        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            throw new BadRequestError("Category not found");
        }

        const product = new Product({
            name,
            price,
            description,
            category: categoryDoc._id,
            image,
            size,
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
