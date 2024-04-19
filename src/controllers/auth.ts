import { Request, Response, NextFunction } from "express";
import { ForbiddenError, InternalServerError } from "../errors/ApiError";

const jwt = require('jsonwebtoken');

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const payload = {};
    const options = { expiresIn: process.env.JWT_EXPIRES_IN };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, options);
    const refreshOptions = { expiresIn: process.env.REFRESH_TOKEN_LIFE };
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions);
    const output = { token, refreshToken };
    return res.json(output);
};

async function refreshAccessToken(request: Request, response: Response, next: NextFunction) {
    try {
        const refreshToken = request.cookies['refreshToken'];
        console.log('Received refresh token:', refreshToken);
        if (!refreshToken) {
            return response.status(400).json({ message: "Refresh token is required" });
        }
        
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        if (!decoded || typeof decoded === 'string') {
            return response.status(401).json({ message: "Invalid refresh token" });
        }
        
        const { email, id } = decoded as { email: string; id: string };
        if (!email || !id) {
            return response.status(400).json({ message: "Invalid refresh token" });
        }
        
        const newAccessToken = jwt.sign({ email, id }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });
        const newRefreshToken = jwt.sign({ email, id }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "20d",
        });
        
        response.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        
        response.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal server error" });
    }
}

export { refreshToken, refreshAccessToken };