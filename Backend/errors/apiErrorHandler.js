function apiErrorHandler(err, req, res, next) {
  const code = typeof err.code === "number" ? err.code : 500;
  const status = typeof err.status === "string" ? err.status : "Internal Server Error";

  console.error("Error:", err.message);

  res.status(code).json({
    success: false,
    code,
    status,
    message: err.message || "Something went wrong",
  });
}

module.exports = apiErrorHandler;
