import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import express from "express";
import mongoose from "mongoose";
import { validateLogin } from "./validation.js";
import { login } from "./schema.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import AsyncHandler from "../middlewares/AsyncHandler.js";
import validate from "./validate.js";

export const routerLogin = express.Router();

routerLogin.get(
  "/",
  auth,
  AsyncHandler(async (req, res) => {
    const AllLogin = await login.find();
    res.status(200).send(AllLogin);
  })
);

routerLogin.get(
  "/me",
  auth,
  AsyncHandler(async (req, res) => {
    const user = await login.findById(req.user._id).select("name email role");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  })
);

routerLogin.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Course with id ${courseId} was not found`);
    }
    const requestedCourse = await login.findById(courseId);
    if (!requestedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(requestedCourse);
  })
);

routerLogin.post(
  "/",
  [validate(validateLogin)],
  AsyncHandler(async (req, res) => {
    const prevEmail = await login.findOne({ email: req.body.email });
    if (prevEmail)
      return res
        .status(400)
        .send(
          `Email with given address ${req.body.email} already exist in the database`
        );
    const newLogin = new login(
      _.pick(req.body, ["name", "email", "password", "role"])
    );
    const salt = await bcrypt.genSalt(10);
    newLogin.password = await bcrypt.hash(newLogin.password, salt);
    await newLogin.save();
    const user = _.pick(newLogin, ["_id", "name", "email", "role"]);

    const token = jwt.sign(
      { _id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.jwtPrivateKey
    );
    res.header("x-auth-token", token).send(token);
  })
);

routerLogin.put(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedCourse = await login.findByIdAndUpdate(
      courseId,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(updatedCourse);
  })
);

routerLogin.delete(
  "/:id",
  [auth, admin],
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const deletedCourse = await login.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(`Course with id ${courseId} has been deleted`);
  })
);
