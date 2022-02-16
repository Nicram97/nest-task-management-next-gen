import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: ['DONE', 'IN_PROGRESS', 'OPEN'] })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
