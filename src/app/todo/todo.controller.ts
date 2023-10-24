import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { CreateTodoSwagger } from './swagger/create-todo.swagger';
import { ShowTodoSwagger } from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger';
import { BadRequestSwagger } from '../helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from '../helpers/swagger/not-found.swagger';

@Controller('api/v1/todos')
@ApiTags('To-dos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Sucesso',
    type: IndexTodoSwagger,
    isArray: true,
  })
  public async index() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Exibir dados de uma tarefa' })
  @ApiResponse({ status: 200, description: 'Sucesso', type: ShowTodoSwagger })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
    type: NotFoundSwagger,
  })
  public async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Sucesso', type: CreateTodoSwagger })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    type: BadRequestSwagger,
  })
  public async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar os dados uma tarefa' })
  @ApiResponse({ status: 200, description: 'Sucesso', type: UpdateTodoSwagger })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
    type: NotFoundSwagger,
  })
  public async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma tarefa' })
  @ApiResponse({ status: 204, description: 'Sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Não encontrado',
    type: NotFoundSwagger,
  })
  public async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
