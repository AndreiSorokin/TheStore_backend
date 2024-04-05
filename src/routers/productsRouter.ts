import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct,
} from "../controllers/products";
import adminCheck from "../middlewares/adminCheck";
import passport from "passport";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

router.get("/",getAllProducts);
router.get("/:id",getOneProduct);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  createProduct
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  updateProduct
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteProduct
);

export default router;
