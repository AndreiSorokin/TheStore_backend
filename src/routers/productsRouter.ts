import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct,
} from "../controllers/products";
import passport from "passport";
import adminCheck from "../middlewares/adminCheck";
import { Role } from "../misc/types";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck(Role.ADMIN),
  createProduct
);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
