import { clsx } from 'clsx';

export interface SelectVariantProps {
  className?: string;
}

export function getSelectClassName(props: SelectVariantProps): string {
  const { className } = props;
  return clsx(
    'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className
  );
}
