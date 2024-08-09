import { TestBed } from '@automock/jest';
import { QueryFailedError, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';

import { UserEntity } from 'entities';
import { UsersService } from '../services/users.service';
import { CreateUserDto, GetUserQueryDto } from 'users/dto';

describe('UsersService', () => {
  // Service to be tested
  let usersService: UsersService;

  // Dependancies
  let userModel: jest.Mocked<Repository<UserEntity>>;

  // mockObjects
  const createUserDto: CreateUserDto = {
    name: 'John',
    surname: 'Doe',
    username: 'john_doe',
    birthdate: new Date('1990-01-01'),
  };

  const mockuserId = 'uuid';

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();

    usersService = unit;
    userModel = unitRef.get(getRepositoryToken(UserEntity) as string);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('find', () => {
    it('should throw BadRequestException when min_age is greater than max_age', async () => {
      const query: GetUserQueryDto = { min_age: 30, max_age: 20 };

      await expect(usersService.find(query)).rejects.toThrow(
        new BadRequestException('min_age must be less than max_age'),
      );
    });
  });

  describe('create', () => {
    it('should create a user and return userId', async () => {
      const mockUser = {
        id: mockuserId,
        ...createUserDto,
      };

      jest.spyOn(userModel, 'create').mockReturnValue(mockUser as UserEntity);
      jest.spyOn(userModel, 'save').mockResolvedValueOnce(mockUser as UserEntity);

      const result = await usersService.create(createUserDto);

      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(userModel.save).toHaveBeenCalledWith(mockUser);

      expect(result.userId).toBe(mockuserId);
    });

    it('should throw ConflictException if username already exists', async () => {
      const error = new QueryFailedError('', [], { code: '23505' } as unknown as Error);
      jest.spyOn(userModel, 'save').mockRejectedValueOnce(error);

      await expect(usersService.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
});
