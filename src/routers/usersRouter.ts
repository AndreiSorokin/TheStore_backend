import express from "express";
import multer from 'multer';

import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  loginUser,
  forgotPassword,
  updatePassword,
  updateUserStatus,
  assingAdmin,
  removeAdmin,
  googleLogin,
  resetPassword
} from "../controllers/users";

import adminCheck from "../middlewares/adminCheck";
import passport from "passport";
import userStatusCheck from "../middlewares/userStatusCheck";
import { refreshAccessToken } from "../controllers/auth";
import { getCartByUserId } from "../controllers/cart";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id/cart", getCartByUserId);

router.post("/login", loginUser);
router.post("/registration", upload.single('avatar'), createUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword)

router.get(
  "/",
  getAllUser
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getSingleUser
);

router.post("/", createUser);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateUser
);

router.put(
  "/:id/userInformation",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  assingAdmin
);

router.put(
  "/:id/update-password",
  passport.authenticate("jwt", { session: false }),
  updatePassword
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  deleteUser
);

router.post(
  "/changeUserStatus",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  updateUserStatus
);

router.post("/auth/google",
passport.authenticate("google-id-token", { session: false }),
googleLogin);

router.post("/refreshToken", refreshAccessToken)
export default router;
