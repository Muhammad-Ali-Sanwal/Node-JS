import express from "express";
import error from "../middlewares/error.js";
import { router } from "../components/routes.js";
import { routerStudent } from "../components/studentRoutes.js";
import { routerLogin } from "../components/loginRoutes.js";
import { routerAuth } from "../components/auth.js";
import { connectDB } from "../components/connection.js";

const app = express();

export default function StartUp() {
  app.use(express.json());
  connectDB();
  app.use("/api/courses", router);
  app.use("/api/students", routerStudent);
  app.use("/api/login", routerLogin);
  app.use("/api/auth", routerAuth);
  app.use(error);
  app.get("/", (req, res) => {
    res.send("Wellcome to study app");
  });
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}

export function HandleExceptionAndErrors() {
  // we do this to catch any uncaught exception that might happen in the app also does not catched by express by using it our app will never crash
  process.on("uncaughtException", (ex) => {
    console.error(ex.message, ex);
    process.exit(1);
  });
  // we do this to catch any unhandled rejection that might happen in the app also does not catched by express by using it our app will never crash
  process.on("unhandledRejection", (ex) => {
    console.error(ex.message, ex);
    process.exit(1);
  });
}
