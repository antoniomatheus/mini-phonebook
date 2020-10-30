export const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted id ' });
  }

  next(error);
};
