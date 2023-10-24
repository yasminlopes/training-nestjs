import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { todo } from 'node:test';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task-1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'task-2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task-3', isDone: 0 }),
];

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            findOneOrFail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return a todo list entity successfully', async () => {
      // act
      const result = await todoController.index();

      // assert
      expect(result).toEqual(todoEntityList);
      expect(typeof result).toEqual('object');
      expect(result[0].id).toEqual(todoEntityList[0].id);
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when the service fails', async () => {
      // arrange
      jest.spyOn(todoService, 'findAll').mockRejectedValue(new Error());

      // act
      const result = todoController.index();

      // assert
      await expect(result).rejects.toThrowError();
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

// Arrange: Preparar os dados
// Act: Executar o método
// Assert: Verificar se o resultado é o esperado
