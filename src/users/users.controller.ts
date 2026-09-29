import { Controller, Get, Param,Post,Body, ConflictException } from '@nestjs/common';
import { UserService } from './users.service.js';
import { CreateUsersDto } from './dto/create-users.dto.interface.js';
import { UserRepository } from '../database/repositorise/user.repository.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

 @Post()
create(@Body() createUsersDto: CreateUsersDto) {
  return this.userService.create(createUsersDto);
}
}