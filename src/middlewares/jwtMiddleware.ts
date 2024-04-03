import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

// export function authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
//     if (typeof req.body.refreshToken === 'undefined' || req.body.refreshToken == null) return res.sendStatus(401)
//     const refreshToken = req.body.refreshToken;
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any) => {
//         if (err) {
//             console.log(err)
//             return res.sendStatus(403)
//         } else {
//             next()
//         }
//     })
// }

// export function authenticateToken(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.JWT_SECRET, (err: any) => {
//         if (err) {
//             return res.sendStatus(403)
//         } else {
//             next()
//         }
//     })
// }

// export function authenticateJwtToken(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     if (token == null) return res.json({ status: 401, message: "Unauthorized" });

//     jwt.verify(token, process.env.JWT_SECRET, (err: any) => {
//         if (err) {
//             return res.json({ status: 403, message: "Forbidden" });
//         } else {
//             next()
//         }
//     })
// }