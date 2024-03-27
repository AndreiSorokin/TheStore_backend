import { Request, Response, NextFunction } from "express";
import { User } from '../misc/types';

export default function roleChecker(request: Request & { user?: User }, response: Response, next: NextFunction) {
   const userRole = request.user?.role;
   
   if (userRole && (userRole === 'ADMIN' || userRole === 'CUSTOMER')) {
      next();
   } else {
      response.status(403).json({ error: 'Forbidden' });
   }
}
