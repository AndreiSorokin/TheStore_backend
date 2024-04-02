import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../models/User";
import { Role, User } from "../misc/types";

const adminCheck = (...roles: string[]) => {
  console.log('adminCheck')
  return (request: Request, response: Response, next: NextFunction) => {
    const userInformation = request.user as UserDocument;
    console.log('userInformation', userInformation)
    if (!roles.includes(userInformation?.role)) {
      throw new ForbiddenError("You don't have access to this operation");
    }
    next();
  };
};

// const adminCheck = () => {
//   return (request: Request, response: Response, next: NextFunction) => {
//     const userInformation = request.user as UserDocument;
//     if (userInformation.role !== Role.ADMIN) {
//       throw new ForbiddenError("You don't have access to this operation");
//     }
//     next();
//   };
// };

export default adminCheck;