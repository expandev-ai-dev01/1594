import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/core/components';
import { useCreateTask } from '../../hooks/useCreateTask';
import { Priority } from '../../types';
import type { QuickAddTaskProps } from './types';

const quickAddTaskSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
});

type QuickAddTaskForm = z.infer<typeof quickAddTaskSchema>;

export const QuickAddTask = (props: QuickAddTaskProps) => {
  const { register, handleSubmit, formState, reset } = useForm<QuickAddTaskForm>({
    resolver: zodResolver(quickAddTaskSchema),
  });

  const { mutate: createTask, isPending } = useCreateTask();

  const onSubmit = (data: QuickAddTaskForm) => {
    createTask(
      {
        ...data,
        priority: Priority.Medium,
        dueDate: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="flex-grow">
        <Input
          placeholder="Adicionar uma nova tarefa..."
          disabled={isPending}
          {...register('title')}
        />
        {formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">{formState.errors.title.message}</p>
        )}
      </div>
    </form>
  );
};
