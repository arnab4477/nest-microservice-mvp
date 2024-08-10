import { IsBoolean, IsUUID } from 'class-validator';

export class BlockOrUnblockUserDto {
  @IsUUID(4)
  blockedId: string;

  @IsBoolean()
  block: boolean;
}
