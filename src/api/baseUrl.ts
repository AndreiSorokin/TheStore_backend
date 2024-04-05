import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const port = process.env.PORT as string;
export const baseUrl = `http://localhost:${port}`;
