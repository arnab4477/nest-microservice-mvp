import { Request } from 'express';
import { Body, Controller, InternalServerErrorException, Put, Req } from '@nestjs/common';

import { BlockOrUnblockUserDto } from 'block/dto';
import { BlockService } from '../services/block.service';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Put('/')
  block(@Body() data: BlockOrUnblockUserDto, @Req() req: Request) {
    const blockerId = req.headers['user_id'] as string;

    if (!blockerId) {
      // This should never happen
      // Send the error info to Sentry or another monitoring service
      throw new InternalServerErrorException();
    }

    return this.blockService.block({ blockerId, blockedId: data.blockedId, block: data.block });
  }
}
