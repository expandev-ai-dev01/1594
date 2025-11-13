import { Priority } from '../types';

export const PRIORITY_MAP: Record<Priority, string> = {
  [Priority.Low]: 'Baixa',
  [Priority.Medium]: 'Média',
  [Priority.High]: 'Alta',
};

export const PRIORITY_OPTIONS = [
  { value: Priority.Low, label: 'Baixa' },
  { value: Priority.Medium, label: 'Média' },
  { value: Priority.High, label: 'Alta' },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.Low]: 'bg-blue-100 text-blue-800',
  [Priority.Medium]: 'bg-yellow-100 text-yellow-800',
  [Priority.High]: 'bg-red-100 text-red-800',
};
