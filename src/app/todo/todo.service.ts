import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TodoEntity } from './entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  public async findAll() {
    return await this.todoRepository.find();
  }

  public async findOneOrFail(id: string) {
    try {
      return await this.todoRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async create(data: CreateTodoDto) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  public async update(id: string, data: UpdateTodoDto) {
    const todo = await this.findOneOrFail(id);

    this.todoRepository.merge(todo, data);
    return await this.todoRepository.save(todo);
  }

  public async deleteById(id: string) {
    await this.findOneOrFail(id);

    await this.todoRepository.softDelete(id);
  }
}
