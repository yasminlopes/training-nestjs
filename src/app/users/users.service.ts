import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: Repository<UsersEntity>) {}
}
