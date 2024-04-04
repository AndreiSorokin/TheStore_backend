import express from "express";
import {
   getAllCategory,
   createCategory,
   deleteCategory,
   getOneCategory,
   updateCategory,
} from "../controllers/category";
import userStatusCheck from "../middlewares/userStatusCheck";
import adminCheck from "../middlewares/adminCheck";
import passport from "passport";

const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", getOneCategory);

router.post("/", 
passport.authenticate("jwt", { session: false }),
userStatusCheck,
adminCheck,
createCategory);

router.put("/:id",
passport.authenticate("jwt", { session: false }),
userStatusCheck,
adminCheck,
updateCategory);

router.delete("/:id", 
passport.authenticate("jwt", { session: false }),
userStatusCheck,
adminCheck,
deleteCategory);

export default router;
