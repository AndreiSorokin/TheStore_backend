import express, { Request, Response } from "express";
import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  getAllOrdersByUserId,
} from "../controllers/users";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getSingleUser);

router.post("/create", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Todo: Display routes for fetching all orders by User
router.get("/:userId/orders", getAllOrdersByUserId);

export default router;
