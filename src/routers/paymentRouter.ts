import express from "express";
import passport from "passport";

import { stripePayment } from "../controllers/stripePayment";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/",stripePayment);

export default router;