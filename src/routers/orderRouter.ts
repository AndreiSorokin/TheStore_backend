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
import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

// Todo: get all orders by Admin
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllOrders
);

// Todo: create a new order by user
router.post(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  createOrder
);

// Todo: get single order by admin
router.get(
  "/admin/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getOrderById
);

// Todo: update order by user
router.put(
  "/:userId/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateOrder
);

// Todo: delete order by Admin
router.delete(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteOrder
);

// Todo: fetch all orders by User
router.get(
  "/:userId/get-orders",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllOrdersByUserId
);

export default router;
// Lam Ngo
