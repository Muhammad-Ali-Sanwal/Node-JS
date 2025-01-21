import Joi from "joi";

export const validateCourse = (course) => {
  const schema = Joi.object({
    courseName: Joi.string().min(3).max(50).trim().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string().min(1).trim()).min(1).required(),
    authorName: Joi.string().min(3).max(50).trim().required(),
    isPublished: Joi.boolean().required(),
    publishedDate: Joi.date(),
  });
  return schema.validate(course);
};

export const validateStudent = (student) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).trim().required(),
    FName: Joi.string().min(3).max(50).trim().required(),
    marks: Joi.string().min(3).max(50).trim().required(),
  });
  return schema.validate(student);
};
export const validateAuth = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(req);
};

export const validateLogin = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
      .min(8)
      .max(50)
      .trim()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      }),
    role: Joi.string().valid("Admin", "User"),
  });
  return schema.validate(user);
};
