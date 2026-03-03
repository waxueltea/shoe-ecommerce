const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return res.status(400).json({
      error: 'Duplicate entry',
      message: 'A record with this value already exists'
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced record does not exist'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
