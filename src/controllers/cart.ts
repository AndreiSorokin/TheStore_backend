import { Request, Response, NextFunction } from "express";

import cartService from "../services/cart";
import { Types } from "mongoose";

export async function getCartByUserId(req: Request, res: Response, next: NextFunction) {
   try {
      const userId = req.params.id;
      const objectId = new Types.ObjectId(userId);
      const cart = await cartService.getCartByUserId(objectId);
      if (!cart) {
         return res.status(404).json({ message: "Cart not found for the given user." });
      }
      res.status(200).json(cart);
   } catch (error) {
      console.log(error)
   }
}

export async function addProductToUserCart(req: Request, res: Response, next: NextFunction) {
   try {
      const { userId, productId, quantity } = req.body;

      const updatedCart = await cartService.addProductToCart(userId, productId, quantity);
      res.status(200).json({
         message: "Product added to cart successfully",
         cart: updatedCart
      });
   } catch (error) {
      console.log(error);
   }
}