import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

interface CustomError {
  statusCode: number;
  msg: string;
}

interface ValidationError {
  message: string;
}

const errorHandlerMiddleware: ErrorRequestHandler = (
  err: any,
  req,
  res,
  next
) => {
  let customError: CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((item: any) => {
      const validationError = item as ValidationError; 
      return validationError.message;
    });
    customError.msg = messages.join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.name === 'JsonWebTokenError') {
    customError.msg = 'Invalid token. Please log in again.';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    customError.msg = 'Your token has expired. Please log in again.';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.name === 'MulterError') {
    customError.msg = `File upload error: ${err.message}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    customError.msg = 'Database error. Please try again later.';
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  console.error(err);

  res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;