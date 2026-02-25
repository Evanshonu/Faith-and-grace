const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error:   err.message || 'Internal Server Error',
    stack:   process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;