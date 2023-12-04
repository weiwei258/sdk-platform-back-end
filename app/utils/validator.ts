import { validate } from 'class-validator';
import { HttpException, HttpStatus } from '../errors';

export async function validateParams<T extends {}, D extends {}>(data: D, validatorClass: new () => T): Promise<T> {

  const validator = new validatorClass();
  Object.assign(validator, data);

  const errors = await validate(validator);
  const message = errors.map(error => Object.values(error.constraints || [])).join('、');

  if (errors.length) {
    throw new HttpException(
      { message, code: HttpStatus.BAD_REQUEST },
      HttpStatus.OK,
    );
  }

  return validator;
}
