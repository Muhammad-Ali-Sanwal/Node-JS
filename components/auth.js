import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import express from "express";
import mongoose from "mongoose";
import { validateAuth } from "./validation.js";
import { login } from "./schema.js";
import AsyncHandler from "../middlewares/AsyncHandler.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import validate from "./validate.js";

export const routerAuth = express.Router();

routerAuth.get(
  "/",
  AsyncHandler(async (req, res) => {
    const AllLogin = await login.find();
    res.status(200).send(AllLogin);
  })
);

routerAuth.get(
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

routerAuth.post(
  "/",
  [validate(validateAuth)],
  AsyncHandler(async (req, res) => {
    const user = await login.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Incorrect email`);
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) return res.status(400).send("Incorrect password");

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.jwtPrivateKey
    );
    res.header("x-auth-token", token).send(token);
  })
);

routerAuth.put(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const { error } = validateAuth(req.body);
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

routerAuth.delete(
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
