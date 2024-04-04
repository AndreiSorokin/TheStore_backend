import express from "express";

import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  loginUser,
  forgotPassword,
  assingAdmin,
  removeAdmin
} from "../controllers/users";
import adminCheck from "../middlewares/adminCheck";
import passport from "passport";

const router = express.Router();

router.post("/login", loginUser);
router.post("/registration", createUser);

router.route("/forgot-password").post(forgotPassword);


router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  getAllUser
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getSingleUser
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateUser
);

router.put("/:id/userInformation", passport.authenticate("jwt", { session: false }), adminCheck, assingAdmin)

router.put("/:id/userInformation", passport.authenticate("jwt", { session: false }), adminCheck, removeAdmin)

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  deleteUser
);

export default router;

