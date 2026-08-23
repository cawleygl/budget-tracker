import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { AppDataSource } from "./db/data-source.ts";

const app = express();
const port = 3000;

app.use(cors({
  origin: process.env.VITE_SERVER_URL,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

await AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.log("Database connection error: ", error);
  });
