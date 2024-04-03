import express from "express";
import {
   getAllCategory,
   createCategory,
   deleteCategory,
   getOneCategory,
   updateCategory,
} from "../controllers/category";

const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", getOneCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
