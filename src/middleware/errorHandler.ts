import { ValidationError } from 'joi';
import { ErrorRequestHandler } from 'express';
export class ServiceError extends Error {
  code = 502;
}

export class LimiterError extends ServiceError {
  code = 429;
}
export class AuthError extends ServiceError {
  code = 401;
  message = 'Unauthorized';
}
export class InternalServerError extends ServiceError {
  code = 500;
}
export class BadRequest extends ServiceError {
  code = 400;
}
export class NotFound extends ServiceError {
  code = 404;
}
export class JoiError {
  message: string;
  code: number;
  constructor(err: ValidationError) {
    this.message = err.message;
    this.code = 400;
  }
}

interface ErrSpecial {
  isJoi: boolean;
  errors: [{ message: string; path: string[]; context: { key: string; context: string } }];
}
const createBadRequest = (err: ErrSpecial) => ({
  message: err.errors.reduce((acc, curr) => {
    acc[curr.context.key] = curr.message.replace(/['"]+/g, '');
    return acc;
  }, {} as Record<string, string>),
  code: 400,
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const finalErr = (() => {
    if (err instanceof BadRequest) return err;
    if (err instanceof ServiceError) return err;
    if (err.isJoi) return createBadRequest(err);
    return new InternalServerError();
  })();
  return res.status(finalErr.code).json(finalErr.message);
};

export default errorHandler;
