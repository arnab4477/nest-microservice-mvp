import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBlockEntity } from 'entities';
import { BlockService } from './services/block.service';
import { BlockController } from './controllers/block.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserBlockEntity])],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
