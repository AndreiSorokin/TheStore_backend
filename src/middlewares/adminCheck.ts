import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../models/User";
import { Role } from "../misc/types";

const adminCheck = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    const userInformation = request.user as UserDocument;
    console.log(userInformation);
    if (!roles.includes(userInformation?.role)) {
      throw new ForbiddenError("Unauthorized to access this route");
    }
    next();
  };
};

export default adminCheck;
