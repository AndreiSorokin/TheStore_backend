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
import { Role } from "../misc/types";
import adminCheck from "../middlewares/adminCheck";

const router = express.Router();

// Lam

// Todo: get all orders
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck(Role.ADMIN),
  getAllOrders
);
// Todo: create order
router.post(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  createOrder
);
// Todo: get single order
router.get(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  adminCheck(Role.ADMIN),
  getOrderById
);
// Todo: update order
router.put(
  "/:userId/:orderId",
  passport.authenticate("jwt", { session: false }),
  updateOrder
);
// Todo: delete order
router.delete(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  adminCheck(Role.ADMIN),
  deleteOrder
);

// Todo: fetch all orders by User
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  getAllOrdersByUserId
);

export default router;
