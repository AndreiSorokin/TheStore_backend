import express, { Request, Response, NextFunction } from "express";
import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser
} from "../controllers/users"

const router = express.Router();

router.get("/", getAllUser)
router.get("/:id", getSingleUser)

router.post("/create", createUser);
router.put("/:id", updateUser)
router.delete("/:id", deleteUser);

/**** added by muzahid || for demo purpose */

// import checkUserRole from '../middlewares/checkUserRole';

// interface CustomRequest extends Request {
//   userRole?: string
//   userInfo?: any;
// }

// router.use('/:username', function (req: Request, res: Response, next: NextFunction) {
//   const username = req.params.username;
//   console.log('username => ', username);
//   checkUserRole(username)(req as CustomRequest, res, next);
// }, (req: CustomRequest, res, next: NextFunction) => {
//   if (Object.keys(req.userInfo).length > 0) {
//     if (req.userInfo.access.read) {
//       router.get("/", getAllUser);
//       router.get("/:id", getSingleUser);
//     }
//     if (req.userInfo.access.create) {
//       router.post("/create", createUser);
//     }
//     if (req.userInfo.access.update) {
//       router.put("/:id", updateUser);
//     }
//     if (req.userInfo.access.delete) {
//       router.delete("/:id", deleteUser);
//     }
//     next();
//   } else {
//     res.status(403).json({ message: 'Forbidden' });
//   }
// });

/**** added by muzahid || for demo purpose */

export default router;