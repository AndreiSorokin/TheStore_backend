import { FilterQuery } from "mongoose";

import { BadRequestError, NotFoundError } from "../errors/ApiError"
import Product, { ProductDocument } from "../models/Product"

const getAllProducts = async(limit: number, offset: number, searchQuery: string, minPrice: number, maxPrice: number): Promise<ProductDocument[]> => {
   const query: FilterQuery<ProductDocument> = {
      price: { $gte: minPrice, $lte: maxPrice }
   };

   if (searchQuery) {
      query.title = { $regex: searchQuery };
   }
   
   return await Product
      // .find({ title: { $regex: searchQuery }, price: { $gte: minPrice, $lte: maxPrice } })
      .find(query)
      .sort( { price: 1 })
      .populate( "category", {name: 1} )
      .limit(limit)
      .skip(offset)
   // use optional query
}

const getOneProduct = async(id: string): Promise<ProductDocument | undefined> => {
   const product = await Product.findById(id)
   if(product) {
      return product;
   }
   throw new NotFoundError();
}

const createProduct = async (product: ProductDocument): Promise<ProductDocument> => {
      const { name, price, description, category, size } = product;
      if (!name || !price || !description || !category || !size) {
         throw new BadRequestError();
      }

      return await product.save();
}

const updateProduct = async(id: string, changedProduct: Partial<ProductDocument>) => {
   if(!id) {
      throw new BadRequestError();
   }

   const options = { new: true, runValidators: true };
   const updatedProduct = await Product.findByIdAndUpdate(id, changedProduct, options);

   if(!updatedProduct) {
      throw new BadRequestError();
   }

   return updatedProduct;
}

const deleteProduct = async(id: string) => {
   const product = await Product.findByIdAndDelete(id)
   if(product) {
      return product;
   }
   throw new NotFoundError();
}


export default { getAllProducts, getOneProduct, createProduct, updateProduct, deleteProduct }