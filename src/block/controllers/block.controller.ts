import { Request } from 'express';
import { Body, Controller, Put, Req } from '@nestjs/common';

import { BlockOrUnblockUserDto } from 'block/dto';
import { BlockService } from '../services/block.service';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Put('/')
  block(@Body() data: BlockOrUnblockUserDto, @Req() req: Request) {
    return this.blockService.block({
      blockerId: req.headers['user_id'] as string,
      blockedId: data.blockedId,
      block: data.block,
    });
  }
}
