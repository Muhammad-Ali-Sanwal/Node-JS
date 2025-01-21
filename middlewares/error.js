export default function (err, req, res, next) {
  console.log("Error happened from error.js", err);
  res.status(500).send("Internal server error happened");
}
