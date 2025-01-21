import { mongoose, Schema } from "mongoose";
import { formatTimestamps } from "../templates/formatTimestamps.js";
const coursesSchema = new Schema(
  {
    courseName: String,
    price: Number,
    tags: [String],
    authorName: String,
    isPublished: Boolean,
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

coursesSchema.plugin(formatTimestamps);
export const course = mongoose.model("Course", coursesSchema);

const studentSchema = new Schema(
  {
    name: String,
    FName: String,
    marks: String,
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

studentSchema.plugin(formatTimestamps);

export const student = mongoose.model("Student", studentSchema);

const LoginSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);
LoginSchema.plugin(formatTimestamps);

export const login = mongoose.model("Login", LoginSchema);
