import express from "express";

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/orders";

const router = express.Router();

// Lam

// get all orders
router.get("/", getAllOrders);
// create order
router.post("/", createOrder);
// get order
router.get("/:id", getOrderById);
// update order
router.put("/:id", updateOrder);
// delete order
router.delete("/:id", deleteOrder);

export default router;
