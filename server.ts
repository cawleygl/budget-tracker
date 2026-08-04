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
import path from "path/win32";
import favicon from "serve-favicon";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

try {
  app.use(favicon('public/favicon.ico'));

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Message Received:", req.method, req.url);
    console.log(new Date(Date.now()).toString());
    next();
  });

  app.use(router);

  app.use((req: Request, res: Response) => {
    console.error(req.method, req.body);
    res.render("error", {
      code: 404,
      name: "Error",
      message: "Route Not Found",
    });
  });
} catch (error) {
  console.error("-------- Error --------");
  console.error(error);
  app.use((req: Request, res: Response) => {
    res.render("error", {
      code: 500,
      name: (error as Error).name,
      message: (error as Error).message,
    });
  });
}

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
