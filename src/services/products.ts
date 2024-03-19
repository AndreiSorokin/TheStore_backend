import Product, { ProductDocument } from "../models/Product"

const getAllProducts = async(): Promise<ProductDocument[]> => {
   return await Product.find()
   //add pagination and filtering by name, categories, variants.
}

const getOneProduct = async(id: string): Promise<ProductDocument | undefined> => {
   const product = await Product.findById(id)
   if(product) {
      return product;
   }
}

const createProduct = async (product: ProductDocument): Promise<ProductDocument> => {
      const { name, price, description, category, size } = product;
      if (!name || !price || !description || !category || !size) {
         throw new Error("Fill out all the fields");
      }

      return await product.save();
}

const updateProduct = async(id: string, changedProduct: Partial<ProductDocument>) => {
   const options = { new: true, runValidators: true }; // Enable validators
   const updatedProduct = await Product.findByIdAndUpdate(id, changedProduct, options);
   return updatedProduct;
}

const deleteProduct = async(id: string) => {
   const product = await Product.findByIdAndDelete(id)
   if(product) {
      return product;
   }
}


export default { getAllProducts, getOneProduct, createProduct, updateProduct, deleteProduct }