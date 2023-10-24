import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async index() {
    return null;
  }

  @Get(':id')
  public async show() {
    return null;
  }

  @Post()
  public async store() {
    return null;
  }

  @Put(':id')
  public async update() {
    return null;
  }

  @Delete(':id')
  public async destroy() {
    return null;
  }
}
