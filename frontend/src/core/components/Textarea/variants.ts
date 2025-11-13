import { clsx } from 'clsx';

export interface TextareaVariantProps {
  className?: string;
}

export function getTextareaClassName(props: TextareaVariantProps): string {
  const { className } = props;
  return clsx(
    'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className
  );
}
