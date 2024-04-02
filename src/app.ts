import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import passport from "passport";

import productsRouter from "./routers/productsRouter";
import usersRouter from "./routers/usersRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";
import errorHandler from "./middlewares/errorHandler";
// import checkUserRole from "./middlewares/adminCheck";
import { googleStrategy, jwtStrategy } from "./config/passport";

import refreshToken from "./controllers/auth";
import jwtApiRouter from './routers/jwtApiRouter';

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleStrategy);

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", usersRouter);

// app.use(
//   "/api/v1/:username/users",
//   (req, res, next) => {
//     const { username } = req.params;
//     checkUserRole(username)(req, res, next);
//   },
//   usersRouter
// );

// JWT || muzahid
app.use("/", jwtApiRouter);
app.post("/refresh-token", refreshToken);
app.post("/verify-token",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("verify-token", req.ip);
    return res.json({ status: 200, message: "Verified" });
  }
);

app.use(errorHandler);

export default app;
