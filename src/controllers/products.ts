import express, { Request, Response } from "express";
import Product from "../models/Product"
import productsService from "../services/products"
import ProductModel, { ProductDocument } from "../models/Product";
import { User } from "../misc/types";

export async function getAllProducts(_: Request, response: Response) {
   const products = await productsService.getAllProducts()
   response.status(200).json(products)
}

export async function getOneProduct(request: Request, response: Response) {
   const product = await productsService.getOneProduct(request.params.id)
   if(!product) {
      return response.status(404).json({ message: "Product not found" });
   }
   response.status(201).json(product)
}

export async function createProduct(request: Request & { user?: User }, response: Response) {
   const userRole = request.user && request.user.role;

   if (userRole === 'admin') {
      const product = new Product(request.body);
      const newProduct = await productsService.createProduct(product);
      response.status(201).json(newProduct);
   } else {
      response.status(403).json({ error: 'Forbidden' });
   }
}

export async function updateProduct(request: Request, response: Response) {
   const id = request.params.id;
   const product: Partial<ProductDocument> = request.body;

   const updatedProduct: ProductDocument | null = await productsService.updateProduct(id, product);

   if (!updatedProduct) {
      return response.status(404).json({ message: "Product not found" });
   }

   response.status(200).json(updatedProduct);
}

export async function deleteProduct(request: Request, response: Response) {
   const id = request.params.id;

   const product = await productsService.deleteProduct(id)

   response.status(204).json({ message: "product has been deleted" }).end()
}