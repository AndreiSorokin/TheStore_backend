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
  removeAdmin,
  updateUserStatus, googleLoginCallback
  updatePassword,
  resetPassword,
} from "../controllers/users";

import adminCheck from "../middlewares/adminCheck";
import passport from "passport";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

router.post("/login", loginUser);
router.post("/registration", createUser);

router.route("/forgot-password").post(forgotPassword);

// Lam version


router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  adminCheck,
  getAllUser
);

// Todo: get a single user by Admin
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  getSingleUser
);

router.post("/", createUser);

// Todo: update a user information
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userStatusCheck,
  updateUser
);

router.put("/:id/userInformation", passport.authenticate("jwt", { session: false }),userStatusCheck, adminCheck, assingAdmin)

router.put("/:id/userInformation", passport.authenticate("jwt", { session: false }),userStatusCheck, adminCheck, removeAdmin)

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
  userStatusCheck,
  adminCheck,
  deleteUser
);


// noor
router.post(
  "/changeUserStatus",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  updateUserStatus
);

// noor

export default router;

/**** Admin Logic || added by muzahid ****/

// interface CustomRequest extends Request {
//   userRole?: string;
//   userInfo?: { read: number; create: number; update: number; delete: number };
// }

// router.get("/", (req: CustomRequest, res: Response, next: NextFunction) => {
//   if (req.userInfo?.read === 1) {
//     getAllUser(req, res, next);
//   } else {
//     res.status(403).json({ message: "Forbidden" });
//   }
// });

// router.get("/:id", (req: CustomRequest, res: Response, next: NextFunction) => {
//   if (req.userInfo?.read === 1) {
//     getSingleUser(req, res, next);
//   } else {
//     res.status(403).json({ message: "Forbidden" });
//   }
// });

// router.post("/", (req: CustomRequest, res: Response, next: NextFunction) => {
//   if (req.userInfo?.create === 1) {
//     createUser(req, res);
//   } else {
//     res.status(403).json({ message: "Forbidden" });
//   }
// });

// router.put("/:id", (req: CustomRequest, res: Response, next: NextFunction) => {
//   if (req.userInfo?.update === 1) {
//     updateUser(req, res);
//   } else {
//     res.status(403).json({ message: "Forbidden" });
//   }
// });

// router.delete(
//   "/:id",
//   (req: CustomRequest, res: Response, next: NextFunction) => {
//     if (req.userInfo?.delete === 1) {
//       deleteUser(req, res);
//     } else {
//       res.status(403).json({ message: "Forbidden" });
//     }
//   }
// );

/**** Admin Logic || added by muzahid ****/

