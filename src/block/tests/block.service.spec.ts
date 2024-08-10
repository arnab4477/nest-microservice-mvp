import { TestBed } from '@automock/jest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

import { UserBlockEntity } from 'entities';
import { BlockService } from 'block/services/block.service';

describe('BlockService', () => {
  // Service to be tested
  let blockService: BlockService;

  // Dependancies
  let userBlockModel: jest.Mocked<Repository<UserBlockEntity>>;

  // mockData
  const commonId = 'uuid';

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(BlockService).compile();

    blockService = unit;
    userBlockModel = unitRef.get(getRepositoryToken(UserBlockEntity) as string);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(blockService).toBeDefined();
  });

  describe('block', () => {
    it('should throw BadRequestException when both blockedId and blockerId are the same', async () => {
      const data = { blockerId: commonId, blockedId: commonId, block: true };

      await expect(blockService.block(data)).rejects.toThrow(BadRequestException);
    });
  });
});
