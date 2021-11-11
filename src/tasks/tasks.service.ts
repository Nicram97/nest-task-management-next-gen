import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks: Task[] = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task: Task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  getTaskById(id: string): Task {
    const foundTask: Task = this.tasks.find((task) => task.id === id);

    if (foundTask) {
      return foundTask;
    }
    throw new NotFoundException(`Task with id: ${id} not found`);
  }

  deleteTask(id: string): void {
    const foundTask: Task = this.getTaskById(id);
    this.tasks = this.tasks.filter((task: Task) => task.id !== foundTask.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskToUpdate: Task = this.getTaskById(id);
    taskToUpdate.status = status;
    return taskToUpdate;
  }
}
