import express, { Request, Response, NextFunction } from "express";
import cartService from "../services/cart";
import Product from "../models/Product";
import { OrderItem } from "../misc/types";
import { CartDocument } from "../models/Cart";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripePayment = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userId = req.body.userId;
      if (!userId) {
         return res.status(400).json({ error: "User ID is required" });
      }

      const cart = await cartService.getCartByUserId(userId) as CartDocument;
      if (!cart) {
         return res.status(404).json({ error: "Cart not found" });
      }

      const lineItems = await Promise.all(cart.cartItems.map(async (item: OrderItem) => {
         const product = await Product.findById(item.productId);
         if (!product) {
            throw new Error(`Product not found for ID: ${item.productId}`);
         }
         return {
            price_data: {
               currency: 'usd',
               product_data: {
                  name: product.name,
               },
               unit_amount: product.price * 100,
            },
            quantity: item.quantity,
         };
      }));


      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: lineItems,
         mode: 'payment',
         success_url: 'http://localhost:8080/api/v1/products',
         cancel_url: 'http://localhost:8080/api/v1/products',
      })
      res.json({ url: session.url });
   } catch (error) {
      res.status(500).json({ error: error });
   }
}

export { stripePayment };