import { Request, Response, NextFunction } from "express";
import User, { UserDocument } from "../models/User";
const jwt = require('jsonwebtoken')


declare global {
   namespace Express {
      interface Request {
         token?: string;
         user?: UserDocument;
      }
   }
}

const userExtractor = async (req: Request, res: Response, next: NextFunction) => {
   const token = req.token

   if (!token) {
      return res.status(401).json({ error: 'token missing' })
   }

   const decodedToken = jwt.verify(token, process.env.SECRET)

   if (!decodedToken.id) {
      return res.status(401).json({ error: 'invalid token' })
   }

   const user = await User.findById(decodedToken.id)

   if (!user) {
      return res.status(404).json({ error: 'user not found' })
   }

   req.user = user
   next()
}