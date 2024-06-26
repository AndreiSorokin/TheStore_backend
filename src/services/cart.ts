import { Types } from "mongoose";
import Cart from "../models/Cart"
import Product from "../models/Product";
import User from "../models/User";
import { NotFoundError } from "../errors/ApiError";


const getCartByUserId = async (userId: Types.ObjectId) => {
   return await Cart.findOne({ userId }).populate("cartItems");
}

const createCart = async(userId: string) => {
   const user = await User.findById(userId);
   if (!user) {
      throw new NotFoundError();
   }
}

async function addProductToCart(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number) {
   let user = await User.findById(userId);

   if(!user) {
      throw new Error('User not found');
   }

   let cart = await Cart.findOne({ userId: userId });
   if (!cart) {
      cart = new Cart({
         userId,
         cartItems: [],
         priceSum: 0
      });
   }

   if (!cart) {
      throw new Error('Cart not found');
   }
   const productIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

   if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += quantity;
   } else {
      cart.cartItems.push({ productId, quantity });
   }

   const product = await Product.findById(productId);
   if (!product) {
      throw new Error('Product not found');
   }
   cart.priceSum += product.price * quantity;

   await cart.save();

   return cart;
}

export default { getCartByUserId, createCart, addProductToCart }