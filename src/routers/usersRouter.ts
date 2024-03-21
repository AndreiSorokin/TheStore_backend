import express, { Request, Response } from "express";
import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser
} from "../controllers/users"

const router = express.Router();

router.get("/", getAllUser)
router.get("/:id", getSingleUser)

router.post("/create", createUser);
router.put("/:id", updateUser)
router.delete("/:id", deleteUser);


export default router;