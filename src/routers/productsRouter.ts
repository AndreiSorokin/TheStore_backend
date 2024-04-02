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

console.log('Role', Role)

router.get("/", getAllProducts)
router.get("/:id", getOneProduct)
router.post("/", passport.authenticate('jwt', { session: false }), adminCheck(Role.ADMIN), createProduct);
router.put("/:id", passport.authenticate('jwt', { session: false }), adminCheck(Role.ADMIN), updateProduct)
router.delete("/:id", passport.authenticate('jwt', { session: false }), adminCheck(Role.ADMIN), deleteProduct);

export default router;
