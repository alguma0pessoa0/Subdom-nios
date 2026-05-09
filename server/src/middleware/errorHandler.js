export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.name === 'PlanError') {
    return res.status(403).json({
      error: 'Plan upgrade required',
      message: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
}

export default errorHandler;
