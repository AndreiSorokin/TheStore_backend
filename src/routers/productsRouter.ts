import express from "express";
import passport from "passport";
import multer from 'multer';

import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct,
} from "../controllers/products";
import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/",getAllProducts);
router.get("/:id",getOneProduct);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  upload.array('images', 5),
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
