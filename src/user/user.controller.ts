/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //view a customer
  @Get('user')
  getUser(@GetUser() user: User) {
    return user;
  }

  //view all the customers
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
