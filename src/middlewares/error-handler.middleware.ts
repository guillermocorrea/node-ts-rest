import { environment } from './../environment';
import { HttpBaseException } from '../exceptions/http-base.exception';
import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!environment.isTestEnvironment) {
    console.error(err, 'errorHandler');
  }
  if (err instanceof HttpBaseException) {
    res.status(err.statusCode).send({ errors: err.messages });
  }
  res.status(500).send();
}
