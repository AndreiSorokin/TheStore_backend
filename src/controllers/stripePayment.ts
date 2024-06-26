
import express, { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import { OrderItem } from "../misc/types";
import { InternalServerError } from "../errors/ApiError";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripePayment = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const cartItems: OrderItem[] = req.body.cartItems;
      if (!cartItems || cartItems.length === 0) {
         return res.status(400).json({ error: "Cart is empty or not provided" });
      }

      const lineItems = await Promise.all(cartItems.map(async (item: OrderItem) => {
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
      });

      res.json({ url: session.url });
   } catch (error) {
      next(new InternalServerError());
   }
};

export { stripePayment };