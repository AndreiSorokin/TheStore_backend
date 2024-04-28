import mongoose from "mongoose";
import app from "./app";

const baseUrl = process.env.MONGO_DB_URL as string;
const port = process.env.PORT as string;

mongoose
  .connect(baseUrl, {
    dbName: "store"
  })
  .then(() => {
    app.listen(port, () => {
    });
  })
  .catch((error: Error) => {
    process.exit(1);
  });
