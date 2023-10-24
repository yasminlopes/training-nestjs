import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task-1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'task-2', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task-3', isDone: 0 }),
];

const newTodoEntity = new TodoEntity({ task: 'new-task', isDone: 0 });

const updatedTodoEntity = new TodoEntity({ task: 'task-1', isDone: 1 });

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
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
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

  describe('create', () => {
    it('should create a todo entity successfully', async () => {
      // arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      jest.spyOn(todoService, 'create').mockResolvedValue(newTodoEntity);

      // act
      const result = await todoController.create(body);

      // assert
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledWith(body);
      expect(todoService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when the service fails', async () => {
      // arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      jest.spyOn(todoService, 'create').mockRejectedValue(new Error());

      // act
      const result = todoController.create(body);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should return a todo entity successfully', async () => {
      // arrange
      const expectedTodo = todoEntityList[0];
      jest.spyOn(todoService, 'findOneOrFail').mockResolvedValue(expectedTodo);

      // act
      const result = await todoController.show('1');

      // assert
      expect(result).toEqual(expectedTodo);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when the service fails', async () => {
      // arrange
      jest.spyOn(todoService, 'findOneOrFail').mockRejectedValue(new Error());

      // act
      const result = todoController.show('1');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo entity successfully', async () => {
      // arrange
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      // act
      const result = await todoController.update('1', body);

      // assert
      expect(result).toEqual(updatedTodoEntity);
    });

    it('should throw an exception when the service fails', async () => {
      // arrange
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      jest.spyOn(todoService, 'update').mockRejectedValue(new Error());

      // act
      const result = todoController.update('1', body);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete a todo entity successfully', async () => {
      // act
      const result = await todoController.destroy('1');

      // assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception when the service fails', async () => {
      // arrange
      jest.spyOn(todoService, 'deleteById').mockRejectedValue(new Error());

      // act
      const result = todoController.destroy('1');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });
});

// Arrange: Preparar os dados
// Act: Executar o método
// Assert: Verificar se o resultado é o esperado
