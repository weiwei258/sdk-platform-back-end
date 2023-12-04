import jwt from 'jsonwebtoken';
import { Jwt } from '../../config/config.default';

// 生成JWT令牌
export const generateToken = (jwtConfig: Jwt, payload: any) => {
  return 'Bearer ' + jwt.sign(payload, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });
};
