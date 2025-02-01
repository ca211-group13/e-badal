export const globalErrorMiddleware = (err, req, res) => {
  console.log(err);
    res
      .status(err.statius || 500)
      .json({
        success: false,
        message: err.message || "Internal Server Error",
      });
};
