export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum Status {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}

export interface Task {
  idTask: number;
  title: string;
  description: string | null;
  dueDate: string;
  priority: Priority;
  status: Status;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  dueDate: string; // ISO string format YYYY-MM-DD
  priority: Priority;
}
