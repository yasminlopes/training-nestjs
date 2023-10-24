import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersEntity } from './entity/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  public async findAll() {
    return await this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  public async findOneOrFail(options?: FindOneOptions<UsersEntity>) {
    try {
      return await this.usersRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async store(user: CreateUserDto) {
    return await this.usersRepository.save(this.usersRepository.create(user));
  }

  public async update(id: string, user: UpdateUserDto) {
    const userFound = await this.findOneOrFail({ where: { id } });
    this.usersRepository.merge(userFound, user);
    return await this.usersRepository.save(userFound);
  }

  public async destroy(id: string) {
    await this.findOneOrFail({ where: { id } });

    await this.usersRepository.softDelete(id);
  }
}
