import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  getOneProduct,
  updateProduct
} from "../controllers/products"

const router = express.Router();

router.get("/", getAllProducts)
router.get("/:id", getOneProduct)
router.post("/", createProduct);
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct);

export default router;
