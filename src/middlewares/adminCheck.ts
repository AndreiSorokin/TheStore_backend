import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../models/User";
import { Role } from "../misc/types";

const adminCheck = (request: Request, response: Response, next: NextFunction) => {
    console.log(request);
    const userInformation = request.user as UserDocument;
    if (userInformation.role !== Role.ADMIN) {
      throw new ForbiddenError("You don't have access to this operation");
    }
    next();
};

export default adminCheck;