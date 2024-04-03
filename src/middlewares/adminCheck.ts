import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../models/User";
import { Role } from "../misc/types";

// const userInfo = [
//   {
//     username: "admin",
//     name: "admin",
//     email: "admin@mail.com",
//     role: "ADMIN",
//     access: { read: 1, create: 1, update: 1, delete: 1 },
//   },
//   {
//     username: "customer",
//     name: "customer",
//     email: "customer@mail.com",
//     role: "CUSTOMER",
//     access: { read: 0, create: 0, update: 0, delete: 0 },
//   },
// ];

// interface CustomRequest extends Request {
//   userRole?: string;
//   userInfo?: { read: number; create: number; update: number; delete: number };
// }

// const checkUserRole = (username: string) => {
//   return (request: CustomRequest, response: Response, next: NextFunction) => {
//     const userExist = userInfo.find((user) => user.username === username);
//     if (userExist) {
//       request.userRole = userExist.role;
//       request.userInfo = userExist.access;
//     } else {
//       request.userRole = "";
//       request.userInfo = { read: 0, create: 0, update: 0, delete: 0 };
//     }
//     next();
//   };
// };

const adminCheck = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    const userInformation = request.user as UserDocument;

    console.log(userInformation);
    if (userInformation?.role !== Role.ADMIN) {
      throw new ForbiddenError("Unauthorized to access this route");
    }
    next();
  };
};

export default adminCheck;
