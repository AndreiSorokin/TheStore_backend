import { Request, Response, NextFunction } from "express";
import userStatusCheck from "../../src/middlewares/userStatusCheck";
import { ForbiddenError } from "../../src/errors/ApiError";
import { UserStatus } from "../../src/misc/types";

describe("userStatusCheck Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("should call next() for ACTIVE user status", () => {
    mockRequest = {
      user: {
        status: UserStatus.ACTIVE,
      },
    };

    userStatusCheck(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should throw ForbiddenError for non-ACTIVE user status", () => {
    mockRequest = {
      user: {
        status: UserStatus.INACTIVE,
      },
    };

    expect(() => {
      userStatusCheck(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(ForbiddenError);
  });
});