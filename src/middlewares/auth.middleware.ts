import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities';

export class AuthMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private userModel: Repository<UserEntity>,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (!['get', 'put'].includes(req.method.toLowerCase())) {
      return next();
    }

    const authorization = req.get('Authorization');
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.replace(/bearer/i, '').trim();
    try {
      const data = jwt.decode(token);
      if (!data || !data.sub || typeof data.sub !== 'string') {
        throw new UnauthorizedException();
      }

      const user = await this.userModel.findOne({
        where: { id: data.sub },
        select: { id: true },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      req.headers['user_id'] = user.id;

      return next();
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
