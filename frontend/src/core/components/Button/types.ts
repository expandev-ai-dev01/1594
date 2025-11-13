import type { ButtonHTMLAttributes } from 'react';
import type { ButtonVariantProps } from './variants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {}
