import Product, { ProductDocument } from "../models/Product"

const getAllProducts = async() => {
   return await Product.find()
}

export default { getAllProducts }