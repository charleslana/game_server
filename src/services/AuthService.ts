import IAuth from '@/interfaces/IAuth';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '@/helpers/ErrorResponse';
import { User } from '@/entities/User';

export class AuthService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET as string;
  }

  generateToken(user: User): string {
    const payload: IAuth = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };
    const options = {
      expiresIn: '1h',
    };
    return jwt.sign(payload, this.secretKey, options);
  }

  verifyJwtToken(token: string): IAuth {
    try {
      const cleanToken = token.replace('Bearer ', '');
      const decodedToken = jwt.verify(cleanToken, this.secretKey) as IAuth;
      if (!('user' in decodedToken) || !('id' in decodedToken.user)) {
        throw new ErrorResponse('invalid.token', 401);
      }
      return decodedToken;
    } catch (error) {
      throw new ErrorResponse('invalid.token', 401);
    }
  }
}
