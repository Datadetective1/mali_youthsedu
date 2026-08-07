import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Buttons and button-styled links.
 *
 * Minimum touch target is 44px on every size, including `sm`: the primary
 * device is a phone held one-handed, often outdoors.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    '[&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
        secondary:
          'bg-white text-brand-800 border-2 border-brand-700 hover:bg-brand-50 active:bg-brand-100',
        accent: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800',
        ghost: 'text-brand-800 hover:bg-brand-50 active:bg-brand-100',
        quiet: 'bg-sand-100 text-sand-800 hover:bg-sand-200 active:bg-sand-300',
        danger: 'bg-danger-600 text-white hover:bg-danger-700',
        link: 'text-brand-700 underline underline-offset-4 hover:text-brand-900',
      },
      size: {
        sm: 'min-h-11 px-3 text-sm',
        md: 'min-h-12 px-4 text-base',
        lg: 'min-h-14 px-6 text-lg',
        icon: 'min-h-11 min-w-11 p-2',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  block,
  ...props
}: ComponentProps<'button'> & ButtonVariants) {
  return (
    <button
      type={props.type ?? 'button'}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  block,
  external,
  ...props
}: ComponentProps<typeof Link> & ButtonVariants & { external?: boolean }) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
}

export { buttonVariants };
