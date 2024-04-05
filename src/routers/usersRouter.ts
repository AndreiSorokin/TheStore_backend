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
  resetPassword,
} from "../controllers/users";
import adminCheck from "../middlewares/adminCheck";
import passport from "passport";

const router = express.Router();

router.post("/login", loginUser);
router.post("/registration", createUser);

// Todo: Send verification link to user email
router.post("/forgot-password", forgotPassword);
// Todo: Reset user password
router.post("/reset-password", resetPassword);

// Todo: get all user by Admin
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllUser
);

// Todo: get a single user by Admin
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getSingleUser
);

// Todo: Create a new user
router.post("/", createUser);

// Todo: update a user information
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateUser
);

// Todo: update a user password
router.put(
  "/:id/update-password",
  passport.authenticate("jwt", { session: false }),
  updatePassword
);

// Todo: Delete a user
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  deleteUser
);

export default router;
