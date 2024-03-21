import { Request, Response, NextFunction } from "express";

const userInfo = [
    { username: 'admin', name: 'admin', email: 'admin@mail.com', role: 'admin', access: { read: 1, edit: 1, update: 1, delete: 1 } },
    { username: 'customer', name: 'customer', email: 'customer@mail.com', role: 'customer', access: { read: 0, edit: 0, update: 0, delete: 0 } },
];

interface CustomRequest extends Request {
    userRole?: string
    userInfo?: object;
}

const checkUserRole = (username: string) => {
    return (request: CustomRequest, response: Response, next: NextFunction) => {
        const userExist = userInfo.find(user => user.username === username);
        if (userExist != undefined) {
            request.userRole = userExist ? userExist.role : '';
            request.userInfo = userExist ? userExist.access : {};
        } else {
            request.userRole = '';
            request.userInfo = {};
        }
        next();
    };
};

export default checkUserRole;