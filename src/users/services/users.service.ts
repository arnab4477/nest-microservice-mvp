import {
  And,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  QueryFailedError,
  Repository,
} from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';

import { UserEntity } from 'entities';
import { CONFIG } from 'config';
import { CreateUserDto, GetUserQueryDto, UpdateUserDto } from 'users/dto';
import { BlockService } from 'block/services/block.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
    private readonly blockService: BlockService,
  ) {}

  async find(query: GetUserQueryDto, currentUserId: string) {
    if (query.min_age && query.max_age && query.max_age < query.min_age) {
      throw new BadRequestException('min_age must be less than max_age');
    }

    const blockdIds = await this.blockService.getBlockedUserIds(currentUserId);

    const condition: FindOptionsWhere<UserEntity> = {
      username: query.username,
      id: Not(In(blockdIds)),
    };

    let maxBirthdate: Date | undefined = undefined;
    let minBirthdate: Date | undefined = undefined;

    if (query.min_age) {
      const today = new Date();
      maxBirthdate = new Date(today.getFullYear() - query.min_age, today.getMonth(), today.getDate());
    }

    if (query.max_age) {
      const today = new Date();
      minBirthdate = new Date(today.getFullYear() - query.max_age, today.getMonth(), today.getDate());
    }

    if (minBirthdate && maxBirthdate) {
      condition.birthdate = And(MoreThanOrEqual(minBirthdate), LessThanOrEqual(maxBirthdate));
    } else if (minBirthdate) {
      condition.birthdate = MoreThanOrEqual(minBirthdate);
    } else if (maxBirthdate) {
      condition.birthdate = LessThanOrEqual(maxBirthdate);
    }

    const [users, count] = await this.userModel.findAndCount({
      where: condition,
      take: query.limit || 12,
      skip: query.offset || 0,
    });

    return { users, count };
  }

  async findOneById(id: string) {
    const user = await this.userModel.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(data: CreateUserDto) {
    try {
      const user = await this.userModel.save(this.userModel.create(data));

      // This token needs to be passed for subsequent GET requests
      const token = jwt.sign({ sub: user.id }, CONFIG.JWT_SECRET, {
        expiresIn: '30d',
      });

      return {
        message: 'success',
        userId: user.id,
        token,
      };
    } catch (err: any) {
      // driverError.code === '23505' means a duplicate key violates a unique constraint
      if (err instanceof QueryFailedError && err.driverError.code === '23505') {
        throw new ConflictException(`this username already exists`);
      }
      console.error(err);

      throw new InternalServerErrorException();
    }
  }

  async update(id: string, data: UpdateUserDto) {
    const exists = await this.userModel.existsBy({ id });
    if (!exists) {
      throw new NotFoundException();
    }
    await this.userModel.update({ id }, data);
    return { message: 'success' };
  }

  async delete(id: string) {
    const exists = await this.userModel.existsBy({ id });
    if (!exists) {
      throw new NotFoundException();
    }
    await this.userModel.delete({ id });
    return { message: 'success' };
  }
}
