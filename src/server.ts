import mongoose from "mongoose";
import app from "./app";

const baseUrl = process.env.MONGO_DB_URL as string;
const port = process.env.PORT as string;

mongoose
  .connect(baseUrl, {
    dbName: "store"
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is up and running on port http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("MongDB connection error:", error);
    process.exit(1);
  });
