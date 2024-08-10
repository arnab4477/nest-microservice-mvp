import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'entities';
import { RedisService } from 'redis/redis.service';

export class AuthMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
    private readonly redisService: RedisService,
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

      const userExists = await this.redisService.get(data.sub);
      if (userExists) {
        req.headers['user_id'] = data.sub;
        return next();
      }

      const exists = await this.userModel.existsBy({ id: data.sub });

      if (!exists) {
        throw new UnauthorizedException();
      }
      this.redisService.set(data.sub, 'true');

      req.headers['user_id'] = data.sub;

      return next();
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
