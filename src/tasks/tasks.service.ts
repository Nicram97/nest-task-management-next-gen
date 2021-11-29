import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    this.logger.log(`getTasks for user ${user.username}`);
    return this.tasksRepository.getTasks(filterDto, user);
  }

  getTaskById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.getTaskById(id, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    await this.tasksRepository.deleteTask(id, user);
  }

  async updateTaskStatus(
    id: string,
    user: User,
    status: TaskStatus,
  ): Promise<Task> {
    const taskToUpdate: Task = await this.getTaskById(id, user);
    taskToUpdate.status = status;
    this.tasksRepository.save(taskToUpdate);
    return taskToUpdate;
  }
}
