import express from "express";
import mongoose from "mongoose";
import { validateStudent } from "./validation.js";
import { student } from "./schema.js";
import { admin } from "../middlewares/admin.js";
import { auth } from "../middlewares/auth.js";
import AsyncHandler from "../middlewares/AsyncHandler.js";
import validate from "./validate.js";

export const routerStudent = express.Router();

routerStudent.get(
  "/",
  AsyncHandler(async (req, res) => {
    const AllCourses = await student.find();
    res.status(200).send(AllCourses);
  })
);

routerStudent.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Course with id ${courseId} was not found`);
    }
    const requestedCourse = await student.findById(courseId);
    if (!requestedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(requestedCourse);
  })
);

routerStudent.post(
  "/",
  validate(validateStudent),
  AsyncHandler(async (req, res) => {
    const newStudent = new student({
      name: req.body.name,
      FName: req.body.FName,
      marks: req.body.marks,
    });
    await newStudent.save();
    const savedCourse = await student
      .findById(newStudent._id)
      .select("-__v -_id");
    res.status(200).send(savedCourse);
  })
);

routerStudent.put(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedCourse = await student.findByIdAndUpdate(
      courseId,
      {
        name: req.body.name,
        FName: req.body.FName,
        marks: req.body.marks,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(updatedCourse);
  })
);

routerStudent.delete(
  "/:id",
  [auth, admin],
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const deletedCourse = await student.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(`Course with id ${courseId} has been deleted`);
  })
);
