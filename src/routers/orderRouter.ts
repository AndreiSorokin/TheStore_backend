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

// Lam

// Todo: get all orders
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getAllOrders
);
// Todo: create order
router.post(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  createOrder
);
// Todo: get single order
router.get(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getOrderById
);
// Todo: update order
router.put(
  "/:userId/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateOrder
);
// Todo: delete order
router.delete(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteOrder
);

// Todo: fetch all orders by User
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllOrdersByUserId
);

export default router;
