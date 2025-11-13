import { useTaskList } from '../../hooks/useTaskList';
import { LoadingSpinner, ErrorMessage } from '@/core/components';
import { TaskItem } from '../TaskItem';
import type { TaskListProps } from './types';

export const TaskList = (props: TaskListProps) => {
  const { data: tasks, isLoading, error } = useTaskList();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage title="Erro ao carregar tarefas" message={error.message} />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Nenhuma tarefa encontrada.</p>
        <p className="text-sm text-gray-500">Crie uma nova tarefa para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.idTask} task={task} />
      ))}
    </div>
  );
};
