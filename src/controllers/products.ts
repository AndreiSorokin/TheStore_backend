import express, { Request, Response } from "express";
import Products from "../models/Product"
import ProductModel, { ProductDocument } from "../models/Product";


export async function getAllProducts(_: Request, response: Response) {
   try {
      const products = await Products.find();
      response.status(200).json(products);
   } catch (error) {
      console.error("Error fetching products:", error);
      response.status(500).json({ message: "Internal server error" });
   }
}

export async function getOneProduct(request: Request, response: Response) {
   try {
      const product = await Products.findById(request.params.id)
      if(product) {
         response.json(product);
      } else {
         response.status(404).json({ message: "product not found" }).end()
      }

   } catch (error) {
      response.status(500).json({ message: "Internal server error" });
   }
}

export async function createProduct(request: Request, response: Response) {
   try {
      const { name, price, description, category, size } = request.body;

      if (!name || !price || !description || !category || !size) {
         return response.status(400).json({ message: "Fill out all the fields" });
      }

      const newProduct: ProductDocument = await ProductModel.create({
         name,
         price,
         description,
         category,
         size
      });

      response.status(201).json(newProduct);
   } catch (error) {
      response.status(500).json({ message: "Internal server error" });
   }
}

export async function updateProduct(request: Request, response: Response) {
   try {
      const id = request.params.id;
      const { name, price, description, category, size } = request.body;
      
      const updatedProduct = await Products.findByIdAndUpdate(
         id,
         { name, price, description, category, size },
         { new: true }
      )

      if(!updateProduct) {
         return response.status(404).json({ message: "product not found" })
      }

      response.status(200).json(updatedProduct);
   } catch (error) {
      response.status(500).json({ message: "Internal server error" });
   }
}

export async function deleteProduct(request: Request, response: Response) {
   const product = await Products.findById(request.params.id);

   if(!product) {
      return response.status(404).json({ message: "product not ffound"})
   }

   await Products.findByIdAndDelete(request.params.id)
   response.status(204).json({ message: "product has been deleted" }).end()
}