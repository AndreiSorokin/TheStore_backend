import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct
} from "../controllers/products"
import adminCheck from "../middlewares/adminCheck";
import { Role } from "../misc/types";
import passport from "passport";

const router = express.Router();

router.get("/", getAllProducts)
router.get("/:id", getOneProduct)
router.post("/", passport.authenticate('jwt', { session: false }), adminCheck, createProduct);
router.put("/:id", passport.authenticate('jwt', { session: false }), adminCheck, updateProduct)
router.delete("/:id", passport.authenticate('jwt', { session: false }), adminCheck, deleteProduct);

export default router;
