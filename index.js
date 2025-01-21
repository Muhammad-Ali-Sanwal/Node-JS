import StartUP from "./startup/routes.js";
import { HandleExceptionAndErrors } from "./startup/routes.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.jwtPrivateKey) {
  console.info("jwtPrivateKey not defined");
  process.exit(1);
}
console.log("JWT Private key is :- ", process.env.jwtPrivateKey);

HandleExceptionAndErrors();
StartUP();
