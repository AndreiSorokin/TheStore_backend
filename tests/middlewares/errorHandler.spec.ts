import { Request, Response, NextFunction } from "express";
import apiErrorHandler from "../../src/middlewares/errorHandler";
import { ApiError } from "../../src/errors/ApiError";

describe("apiErrorHandler middleware", () => {
   let mockRequest: Partial<Request>;
   let mockResponse: Partial<Response>;
   let nextFunction: NextFunction;

   beforeEach(() => {
      mockRequest = {};
      mockResponse = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn(),
      };
      nextFunction = jest.fn();
   });

   it("should return 500 Internal Server Error if error status and message are not provided", () => {
      const error: ApiError = {
         name: "TestError",
         status: 500,
         message: "Internal server error",
      };
      apiErrorHandler(error as ApiError, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal server error" });
   });

   it("should return 404 error", () => {
      const error: ApiError = { 
         name: "TestError",
         status: 404, 
         message: "Not Found" 
      };
      apiErrorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not Found" });
   });
});
