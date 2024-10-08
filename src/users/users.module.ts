import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBlockEntity, UserEntity } from 'entities';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { BlockModule } from 'block/block.module';
import { RedisModule } from 'redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserBlockEntity]), BlockModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
