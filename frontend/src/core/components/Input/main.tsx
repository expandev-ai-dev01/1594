import React from 'react';
import { getInputClassName } from './variants';
import type { InputProps } from './types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={getInputClassName({ className })} {...props} />;
  }
);

Input.displayName = 'Input';
