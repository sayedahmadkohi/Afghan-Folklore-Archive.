const errorHandler = (err, req, res, next) => {
  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  // Log error details for debugging
  console.error(
    `[Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`,
  );
  if (statusCode === 500) {
    console.error(err.stack);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    statusCode = 400;
  }

  // Multer error
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds 5MB limit";
    } else {
      message = err.message;
    }
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
