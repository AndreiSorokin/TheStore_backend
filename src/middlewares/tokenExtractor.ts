import { Request, Response, NextFunction } from "express";

declare global {
   namespace Express {
      interface Request {
         token?: string;
      }
   }
}

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
   const authorization = req.get('authorization')
   if(authorization && authorization.startsWith('Bearer ')) {
      req.token = authorization.replace('Bearer ', '')
   }
   next()
}