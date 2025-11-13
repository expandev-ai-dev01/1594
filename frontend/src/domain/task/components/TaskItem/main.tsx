import { format } from 'date-fns';
import { clsx } from 'clsx';
import type { TaskItemProps } from './types';
import { PRIORITY_MAP, PRIORITY_COLORS } from '../../constants';

export const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm flex justify-between items-start">
      <div>
        <p className="font-semibold text-gray-800">{task.title}</p>
        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        <p className="text-sm text-gray-500 mt-2">
          Vencimento: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
        </p>
      </div>
      <div className="text-right">
        <span
          className={clsx(
            'px-2 py-1 text-xs font-semibold rounded-full',
            PRIORITY_COLORS[task.priority]
          )}
        >
          {PRIORITY_MAP[task.priority]}
        </span>
      </div>
    </div>
  );
};
