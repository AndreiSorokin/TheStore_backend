import { Request, Response } from "express";

import cartService from "../services/cart";

export async function getAllCarts(_: Request, response: Response) {
   try {
      const carts = await cartService.getAllCarts();
      response.status(200).json(carts);
   } catch (error) {
      console.error('Error fetching carts:', error);
   }
}