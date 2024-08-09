import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @Length(1, 20)
  surname: string;

  @IsString()
  @Length(1, 20)
  username: string;

  @IsDateString()
  birthdate: Date;
}

export class GetUserQueryDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @Min(2)
  max_age?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @Min(1)
  min_age?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @Max(24)
  limit?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  offset?: number;
}

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['username']) {}

export class UserIdDto {
  @IsUUID(4)
  id: string;
}
