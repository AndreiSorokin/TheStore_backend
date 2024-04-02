// import { Request, Response, NextFunction } from "express";

// const jwt = require('jsonwebtoken');

// exports.refreshToken = async (eq: Request, res: Response, next: NextFunction) => {
//     const payload = {};
//     const options = { expiresIn: process.env.JWT_EXPIRES_IN };
//     const secret = process.env.JWT_SECRET;
//     const token = jwt.sign(payload, secret, options);
//     const refreshOptions = { expiresIn: process.env.REFRESH_TOKEN_LIFE };
//     const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
//     const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions);
//     const output = { token, refreshToken };
//     return res.json(output);
// }
