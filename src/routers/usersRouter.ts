import express from "express";
import { Request, Response, NextFunction } from 'express';

import {
  getAllUser,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  getAllOrdersByUserId, loginUser
} from "../controllers/users"

const router = express.Router();

router.post("/login", loginUser);
router.post("/registration", createUser);

// Todo: Display routes for fetching all orders by User
router.get("/:userId/orders", getAllOrdersByUserId);

/**** Admin Logic || added by muzahid ****/

interface CustomRequest extends Request {
  userRole?: string
  userInfo?: { read: number, create: number, update: number, delete: number };
}

router.get('/', (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userInfo?.read === 1) {
    getAllUser(req, res, next);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.get('/:id', (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userInfo?.read === 1) {
    getSingleUser(req, res, next);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.post('/', (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userInfo?.create === 1) {
    createUser(req, res);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.put('/:id', (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userInfo?.update === 1) {
    updateUser(req, res);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.delete('/:id', (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userInfo?.delete === 1) {
    deleteUser(req, res);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

/**** Admin Logic || added by muzahid ****/

export default router;