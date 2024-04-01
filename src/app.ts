import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import passport from "passport";

import productsRouter from "./routers/productsRouter";
import usersRouter from "./routers/usersRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";
import errorHandler from "./middlewares/errorHandler";
import checkUserRole from './middlewares/checkUserRole';
import { googleStrategy, jwtStrategy } from "./config/passport";
import { authenticateRefreshToken, authenticateToken, authenticateJwtToken } from './middlewares/jwtMiddleware';

const auth = require('./app/controllers/auth');

dotenv.config({ path: ".env" })

const app = express();
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleStrategy);

app.use("/api/v1/products", productsRouter);

app.use('/api/v1/:username/users', (req, res, next) => {
   const { username } = req.params;
   checkUserRole(username)(req, res, next);
}, usersRouter);

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter)

// JWT || muzahid
app.use('/', authenticateToken, require("./routers/api"));
app.post("/refresh-token", authenticateRefreshToken, auth.refreshToken);
app.post("/verify-token", authenticateJwtToken, (req: Request, res: Response, next: NextFunction) => {
	console.log("verify-token", req.ip);
	return res.json({ status: 200, message: "Verified" });
});

app.use(errorHandler)

export default app
