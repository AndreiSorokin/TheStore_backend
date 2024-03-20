import express, { Request, Response, NextFunction } from "express";
import Product from "../models/Product"
import productsService from "../services/products"
import ProductModel, { ProductDocument } from "../models/Product";
import { User } from "../misc/types";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "../errors/ApiError";
import mongoose from "mongoose";

export async function getAllProducts(_: Request, response: Response, next: NextFunction) {
   try {
      const products = await productsService.getAllProducts()
      response.status(200).json(products)
   } catch (error) {
      next(new InternalServerError("Internal error"))
   }
}

export async function getOneProduct(request: Request, response: Response, next: NextFunction) {
   try {
      const product = await productsService.getOneProduct(request.params.id)
      response.status(201).json(product)
   } catch (error) {
      if(error instanceof NotFoundError) {
         response.status(404).json({
            message: "Product not found",
         });
      } else if(error instanceof mongoose.Error.CastError) {
         response.status(404).json({
            message: "Product not found",
         });
         return;
      }

      next(new InternalServerError());
   }
}

export async function createProduct(request: Request & { user?: User }, response: Response) {
   const userRole = request.user && request.user.role;

   try {
      if (userRole === 'admin') {
         const product = new Product(request.body);
         const newProduct = await productsService.createProduct(product);
         response.status(201).json(newProduct);
      } else {
         throw new ForbiddenError();
      }
   } catch (error) {
      if (error instanceof BadRequestError) {
         response.status(400).json({ error: 'Bad Request' });
      } else {
         response.status(500).json({ error: 'Internal Server Error' });
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
      } else if(error instanceof mongoose.Error.CastError) {
         response.status(404).json({
            message: "Product not found",
         });
         return;
      } else {
         response.status(500).json({ error: 'Internal Server Error' });
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
         response.status(500).json({ error: 'Internal Server Error' });
      }
   }
}