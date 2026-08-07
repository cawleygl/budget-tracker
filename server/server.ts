import "reflect-metadata";
import "dotenv/config";
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { router } from "./routes/index.js";
import { AppDataSource } from "./db/data-source.ts";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    // console.log("Inserting a new user into the database...")
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(User)
    // console.log("Loaded users: ", users)

    // console.log("Here you can setup and run express / fastify / any other framework.")
  })
  .catch((error: any) => {
    console.log("Database connection error: ", error);
  });
