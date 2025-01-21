export default function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      console.log("Error from Middleware", ex.message);
      next(ex);
    }
  };
}
