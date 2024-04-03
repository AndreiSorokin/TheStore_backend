import express from "express";
import { Request, Response, NextFunction } from "express";

import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  loginUser,
  forgotPassword,
} from "../controllers/users";
import adminCheck from "../middlewares/adminCheck";
import passport from "passport";

const router = express.Router();

router.post("/login", loginUser);
router.post("/registration", createUser);

router.route("/forgot-password").post(forgotPassword);

// Lam version


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

router.post("/", createUser);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateUser
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  adminCheck,
  deleteUser
);

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

