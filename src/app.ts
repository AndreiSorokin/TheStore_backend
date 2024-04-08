import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";

import productsRouter from "./routers/productsRouter";
import usersRouter from "./routers/usersRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";
import errorHandler from "./middlewares/errorHandler";
import {
  googleAuthStrategy,
  jwtStrategy,
} from "./config/passport";


dotenv.config({ path: ".env" });

const app = express();
app.use(cors())
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleAuthStrategy);

dotenv.config({ path: ".env" });
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", usersRouter);

app.use(errorHandler);

export default app;
