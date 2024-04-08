import express from "express";

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
  removeAdmin, googleLoginCallback,
} from "../controllers/users";

import adminCheck from "../middlewares/adminCheck";
import passport from "passport";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

router.post("/login", loginUser);
router.post("/registration", createUser);

router.route("/forgot-password").post(forgotPassword);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getAllUser
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
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
  "/:id/userInformation",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  removeAdmin
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

router.get("/auth/google", passport.authenticate('google', { scope: ['profile','email'] }));
router.get("/auth/google/callback",passport.authenticate('google', {   session: false,failureRedirect: '/login' }),googleLoginCallback);
export default router;
