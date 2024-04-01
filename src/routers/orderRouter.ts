import express from "express";

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getAllOrdersByUserId,
  getOrderById,
  updateOrder,
} from "../controllers/orders";
import passport from "passport";

const router = express.Router();

// Lam

// Todo: get all orders
router.get("/", getAllOrders);
// Todo: create order
router.post(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  createOrder
);

// Todo: fetch all orders by User
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  getAllOrdersByUserId
);

// Todo: get single order
router.get("/:id", getOrderById);
// Todo: update order
router.put("/:id", updateOrder);
// Todo: delete order
router.delete("/:id", deleteOrder);

export default router;
