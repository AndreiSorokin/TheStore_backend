import express from "express";

import {
  createOrder,
  getAllOrders,
  getAllOrdersByUserId,
  getOrderById,
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

router.get(
  "/:userId/get-orders",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getAllOrdersByUserId
);

export default router;
