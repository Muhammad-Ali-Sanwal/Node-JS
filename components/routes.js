import express from "express";
import { course } from "./schema.js";
import mongoose from "mongoose";
import { validateCourse } from "./validation.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import AsyncHandler from "../middlewares/AsyncHandler.js";
import validate from "./validate.js";

export const router = express.Router();

router.get(
  "/",
  AsyncHandler(async (req, res) => {
    const AllCourses = await course.find();
    res.status(200).send(AllCourses);
  })
);

router.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Course with id ${courseId} was not found`);
    }
    const requestedCourse = await course.findById(courseId);
    if (!requestedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(requestedCourse);
  })
);

router.post(
  "/",
  [auth, validate(validateCourse)],
  AsyncHandler(async (req, res) => {
    const newCourse = new course({
      courseName: req.body.courseName,
      price: req.body.price,
      tags: req.body.tags,
      authorName: req.body.authorName,
      isPublished: req.body.isPublished,
    });
    await newCourse.save();
    res.send(newCourse);
  })
);

router.put(
  "/:id",
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      {
        courseName: req.body.courseName,
        price: req.body.price,
        tags: req.body.tags,
        authorName: req.body.authorName,
        isPublished: req.body.isPublished,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(updatedCourse);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  AsyncHandler(async (req, res) => {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send(`Invalid ID format: ${courseId}`);
    }
    const deletedCourse = await course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).send(`Course with id ${courseId} was not found`);
    }
    res.status(200).send(`Course with id ${courseId} has been deleted`);
  })
);
