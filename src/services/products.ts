import { FilterQuery } from "mongoose";

import { BadRequestError, NotFoundError } from "../errors/ApiError"
import Product, { ProductDocument } from "../models/Product"
import { Gender, Size } from "../misc/types";

const getAllProducts = async(limit: number, offset: number, searchQuery: string = "", minPrice?: number, maxPrice?: number, categoryQuery?: string, size?: string, gender?: string): Promise<ProductDocument[]> => {
   const query: FilterQuery<ProductDocument> = {};

   if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: minPrice, $lte: maxPrice };
   }

   if (searchQuery) {
      query.name = { $regex: new RegExp(searchQuery, 'i') };
   }

   if (size && [Size.Small, Size.Medium, Size.Large].includes(size as Size)) {
      query.size = size;
   }

   if(gender && [Gender.Male, Gender.Female].includes(gender as Gender)) {
      query.gender = gender;
   }

   // if (categoryQuery) {
   //    query.category.name = { $regex: new RegExp(categoryQuery, 'i') };
   // }
   
   return await Product
      .find(query)
      .sort( { price: 1 })
      .populate( "category", {name: 1, image: 1} )
      .limit(limit)
      .skip(offset)
}

const getOneProduct = async(id: string): Promise<ProductDocument | undefined> => {
   const product = await Product.findById(id).populate("category")
   if(product) {
      return product;
   }
   throw new NotFoundError();
}

const createProduct = async (product: ProductDocument): Promise<ProductDocument> => {
      const { name, price, description, category, images, size, gender } = product;
      if (!name || !price || !description || !category || !images || !size || !gender) {
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