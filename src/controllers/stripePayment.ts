import express, { Request, Response, NextFunction } from "express";
import { Product } from "../misc/types";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripePayment = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         // line_items: req.body.items.map((item: Product) => {
         //    const storeItem = storeItems.get(item.id)
         //    return {
         //       price_data: {
         //          currency: 'usd',
         //          product_data: {
         //             name: item.name,
         //          },
         //          unit_amount: item.price * 100,
         //       },
         //       quantity: item.quantity,
         //    };
         // }),
         mode: 'payment',
         success_url: 'http://localhost:8080/api/v1/products',
         cancel_url: 'http://localhost:8080/api/v1/cart', //add cart
      })
   } catch (error) {
      res.status(500).json({ error: error });
   }
}

export { stripePayment };