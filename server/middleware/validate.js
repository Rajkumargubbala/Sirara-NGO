const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.error('Validation Error:', error);
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.errors ? error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      })) : [{ message: error.message }]
    });
  }
};

module.exports = validate;
