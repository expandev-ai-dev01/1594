import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';

export const useTaskList = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.list,
  });
};
