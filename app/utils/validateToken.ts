import { secretKey } from '../../config/config.default';
import jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '../errors';
import { TokenIncludeInfo } from '../dto/tokenIncludeInfo.dto';

export const validateToken = (authorization?: string): TokenIncludeInfo => {
  try {
    if (authorization) {
      const [ _, token ] = authorization.split(' ');
      return jwt.verify(token, secretKey) as TokenIncludeInfo;
    }
    throw new Error();
  } catch (err) {
    throw new HttpException(
      { message: 'token不合法', code: HttpStatus.BAD_REQUEST },
      HttpStatus.OK,
    );
  }
};

export const checkToken = (authorization?: string): boolean => {
  try {
    if (authorization) {
      const [ _, token ] = authorization.split(' ');
      jwt.verify(token, secretKey) as TokenIncludeInfo;
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
