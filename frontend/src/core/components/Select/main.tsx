import React from 'react';
import { getSelectClassName } from './variants';
import type { SelectProps } from './types';

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select ref={ref} className={getSelectClassName({ className })} {...props}>
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
