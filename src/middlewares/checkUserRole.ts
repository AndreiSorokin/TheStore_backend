import { Request, Response, NextFunction } from "express";

const userInfo = [
    { username: 'admin', name: 'admin', email: 'admin@mail.com', role: 'ADMIN', access: { read: 1, create:1, update: 1, delete: 1 } },
    { username: 'customer', name: 'customer', email: 'customer@mail.com', role: 'CUSTOMER', access: { read: 0, create:0, update: 0, delete: 0 } },
];

interface CustomRequest extends Request {
    userRole?: string
    userInfo?: { read: number, create: number, update: number, delete: number };
}

const checkUserRole = (username: string) => {
    return (request: CustomRequest, response: Response, next: NextFunction) => {
        const userExist = userInfo.find(user => user.username === username);
        if (userExist) {
            request.userRole = userExist.role;
            request.userInfo = userExist.access;
        } else {
            request.userRole = '';
            request.userInfo = { read: 0, create:0, update: 0, delete: 0 };
        }
        next();
    };
};

export default checkUserRole;