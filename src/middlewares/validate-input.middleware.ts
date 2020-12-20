import { BadRequestException } from './../exceptions/bad-request.exception';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function validateInput<T>(dtoClass: any) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const output: any = plainToClass(dtoClass, req.body);
    try {
      const errors = await validate(output, { skipMissingProperties: true });
      // errors is an array of validation errors
      if (errors.length > 0) {
        let errorTexts = Array();
        for (const errorItem of errors) {
          errorTexts = errorTexts.concat(errorItem.constraints);
        }

        next(new BadRequestException(errorTexts));
      } else {
        res.locals.input = output as T;
      }
    } catch (err) {
      next(err);
    }
    next();
  };
}
