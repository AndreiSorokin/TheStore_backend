import express from "express";

import { getAllCarts } from "../controllers/cart"

const router = express.Router();

router.get("/", getAllCarts);

export default router;
