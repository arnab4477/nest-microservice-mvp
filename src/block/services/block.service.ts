import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { UserBlockEntity } from 'entities';

@Injectable()
export class BlockService {
  constructor(@InjectRepository(UserBlockEntity) private readonly userBlockModel: Repository<UserBlockEntity>) {}

  async block(data: { blockerId: string; blockedId: string; block: boolean }) {
    try {
      const { block, blockedId, blockerId } = data;
      if (blockerId === blockedId) {
        throw new BadRequestException('you cannot block yourself dummy!!');
      }

      const exists = await this.userBlockModel.existsBy({ blocker_id: blockerId, blocked_id: blockedId });

      if (!block) {
        if (!exists) {
          throw new ForbiddenException('you have not blocked this user');
        }
        await this.userBlockModel.delete({ blocker_id: blockerId, blocked_id: blockedId });
        return { message: 'success' };
      }

      if (exists) {
        throw new ForbiddenException('you have already blocked this user');
      }

      await this.userBlockModel.save({ blocker_id: blockerId, blocked_id: blockedId });
      return { message: 'success' };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err instanceof QueryFailedError) {
        if (err.message.includes('FK_blocked_id')) {
          throw new NotFoundException('the user you are trying to block does not exist');
        }
      }
      console.error(err);
      throw new InternalServerErrorException(err?.message || '');
    }
  }

  async getBlockedUserIds(blockerId: string) {
    return (
      await this.userBlockModel.find({
        where: { blocker_id: blockerId },
        select: { blocked_id: true },
      })
    ).map((block) => block.blocked_id);
  }
}
