import React from 'react';
import { getButtonClassName } from './variants';
import type { ButtonProps } from './types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, size, fullWidth, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={getButtonClassName({ variant, size, fullWidth, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
