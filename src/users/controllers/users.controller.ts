import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto, UserIdDto, GetUserQueryDto, UpdateUserDto } from 'users/dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get('/search')
  find(@Query() query: GetUserQueryDto) {
    return this.usersService.find(query);
  }

  @Get('/:id')
  findOne(@Param() param: UserIdDto) {
    return this.usersService.findOneById(param.id);
  }

  @Patch('/:id')
  update(@Param() param: UserIdDto, @Body() data: UpdateUserDto) {
    return this.usersService.update(param.id, data);
  }

  @Delete('/:id')
  delete(@Param() param: UserIdDto) {
    return this.usersService.delete(param.id);
  }
}
