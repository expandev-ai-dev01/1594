import React from 'react';
import { getTextareaClassName } from './variants';
import type { TextareaProps } from './types';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return <textarea ref={ref} className={getTextareaClassName({ className })} {...props} />;
  }
);

Textarea.displayName = 'Textarea';
