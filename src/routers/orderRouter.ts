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

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllOrders
);

router.post(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  createOrder
);

router.get(
  "/admin/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getOrderById
);

router.put(
  "/:userId/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateOrder
);

router.delete(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteOrder
);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllOrdersByUserId
);

export default router;
