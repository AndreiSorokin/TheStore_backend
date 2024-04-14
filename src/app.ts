import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import cookieParser from 'cookie-parser';

import productsRouter from "./routers/productsRouter";
import usersRouter from "./routers/usersRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";
import cartRouter from "./routers/cartRouter";
import paymentRouter from "./routers/paymentRouter";
import errorHandler from "./middlewares/errorHandler";
import {
  googleAuthStrategy,
  jwtStrategy,
} from "./config/passport";
import uploadRouter from "./routers/uploadRouter";


dotenv.config({ path: ".env" });

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleAuthStrategy);

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);

app.use(errorHandler);

export default app;
