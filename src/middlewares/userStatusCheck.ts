import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../models/User";
import { Role, UserStatus } from "../misc/types";

const userStatusCheck = (request: Request, response: Response, next: NextFunction) => {
    console.log("user-status-check-middleware");
    const userInformation = request.user as UserDocument;
    if (userInformation.status !== UserStatus.ACTIVE) {
        throw new ForbiddenError("You don't have access to this systems Please contact support ");
    }
     next();
};

export default userStatusCheck;