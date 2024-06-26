import { Request, Response, NextFunction } from "express";

import cartService from "../services/cart";
import { Types } from "mongoose";
import User from "../models/User";
import { InternalServerError } from "../errors/ApiError";

export async function getCartByUserId(req: Request, res: Response, next: NextFunction) {
   try {
      const userId = req.params.id;
      const user = await User.findById(userId);
   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }
      const objectId = new Types.ObjectId(userId);
      const cart = await cartService.getCartByUserId(objectId);
      if (!cart) {
         return res.status(404).json({ message: "Cart not found for the given user." });
      }
      res.status(200).json(cart);
   } catch (error) {
      next(new InternalServerError());
   }
}

export async function addProductToUserCart(req: Request, res: Response, next: NextFunction) {
   try {
      const { userId, productId, quantity } = req.body;

      await cartService.createCart(userId)

      const updatedCart = await cartService.addProductToCart(userId, productId, quantity);
      res.status(200).json({
         message: "Product added to cart successfully",
         cart: updatedCart
      });
   } catch (error) {
      next(new InternalServerError());
   }
}