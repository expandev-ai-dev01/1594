import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button, Input, Select, Textarea } from '@/core/components';
import { useCreateTask } from '../../hooks/useCreateTask';
import { Priority } from '../../types';
import { PRIORITY_OPTIONS } from '../../constants';
import type { TaskFormProps } from './types';

const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres.')
    .max(100, 'O título deve ter no máximo 100 caracteres.'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres.').optional(),
  dueDate: z.string().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }, 'A data de vencimento não pode ser no passado.'),
  priority: z.number().refine((val) => val in Priority, 'Prioridade inválida'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export const TaskForm = ({ onSuccess }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: Priority.Medium,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      description: '',
    },
  });

  const { mutate: createTask, isPending } = useCreateTask();

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    const taskData = {
      title: data.title,
      dueDate: data.dueDate,
      priority: data.priority,
      description: data.description || null,
    };
    createTask(taskData, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <Textarea id="description" {...register('description')} />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Data de Vencimento
        </label>
        <Input id="dueDate" type="date" {...register('dueDate')} />
        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Prioridade
        </label>
        <Select id="priority" {...register('priority', { valueAsNumber: true })}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar Tarefa'}
        </Button>
      </div>
    </form>
  );
};
