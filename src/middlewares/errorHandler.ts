import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";

function apiErrorhandler(
   error: ApiError,
   _: Request,
   response: Response,
   next: NextFunction
) {
   if (!error.status && !error.message) {
      response.status(500).json({ message: "Internal error" });
   }
   response.status(error.status).json({ message: error.message });
}

export default apiErrorhandler;

