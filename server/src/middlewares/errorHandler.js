const errorHandler = (err, req, res, next) => {
  const code = err.code || 500;
  res.status(code).json({
    code: code,
    details: err.details || { message: "Something went wrong" }, // if err.details does not have data
  });
};

module.exports = { errorHandler };
