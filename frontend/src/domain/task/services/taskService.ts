import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto } from '../types';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const taskService = {
  async list(): Promise<Task[]> {
    const response = await authenticatedClient.get<ApiResponse<Task[]>>('/task');
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<{ idTask: number }> {
    const response = await authenticatedClient.post<ApiResponse<{ idTask: number }>>('/task', data);
    return response.data.data;
  },
};
