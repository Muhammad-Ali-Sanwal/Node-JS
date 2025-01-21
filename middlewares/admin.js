export const admin = function (req, res, next) {
  if (req.user.role !== "Admin") {
    return res
      .status(403)
      .send("You do not have permission to perform this action");
  }
  next();
};
