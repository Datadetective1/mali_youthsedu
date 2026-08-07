'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Form primitives.
 *
 * Every control is a real form element with an explicitly associated label and,
 * where present, an `aria-describedby` pointing at its hint and error. This is
 * the part of accessibility that is invisible when it works and catastrophic
 * when it does not.
 *
 * Font size never drops below 16px on inputs: anything smaller makes mobile
 * Safari zoom on focus, which throws the user out of the layout.
 */

const fieldBase =
  'w-full min-h-12 rounded-lg border-2 border-sand-300 bg-white px-3 py-2 text-base ' +
  'text-sand-900 placeholder:text-sand-400 ' +
  'focus:border-brand-600 focus:outline-none ' +
  'disabled:bg-sand-100 disabled:text-sand-500 ' +
  'aria-[invalid=true]:border-danger-600';

export interface FieldShellProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode;
  className?: string;
}

export function Field({ label, hint, error, optional, children, className }: FieldShellProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-sand-800">
        {label}
        {optional ? <span className="ml-1 font-normal text-sand-500">(facultatif)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-sand-600">
          {hint}
        </p>
      ) : null}
      {children({ inputId, describedBy: describedBy || undefined })}
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  optional,
  className,
  ...props
}: ComponentProps<'input'> & { label: ReactNode; hint?: ReactNode; error?: string | null; optional?: boolean }) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={fieldBase}
          {...props}
        />
      )}
    </Field>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  optional,
  className,
  rows = 5,
  ...props
}: ComponentProps<'textarea'> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
}) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ inputId, describedBy }) => (
        <textarea
          id={inputId}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(fieldBase, 'min-h-28 resize-y leading-relaxed')}
          {...props}
        />
      )}
    </Field>
  );
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  options,
  className,
  ...props
}: ComponentProps<'select'> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ inputId, describedBy }) => (
        <select
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(fieldBase, 'appearance-none bg-white pr-8')}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/**
 * Radio group rendered as large tappable cards.
 *
 * A native `<select>` with fifteen options is miserable on a small screen and
 * hides the choices; cards show them all and give a 48px target each.
 */
export function RadioCardGroup({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  error,
  columns = 1,
}: {
  legend: ReactNode;
  hint?: ReactNode;
  name: string;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
  columns?: 1 | 2;
}) {
  const groupId = useId();
  const hintId = `${groupId}-hint`;
  const errorId = `${groupId}-error`;

  return (
    <fieldset
      aria-describedby={[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
    >
      <legend className="mb-1 text-base font-semibold text-sand-900">{legend}</legend>
      {hint ? (
        <p id={hintId} className="mb-3 text-sm text-sand-600">
          {hint}
        </p>
      ) : null}

      <div className={cn('grid gap-2', columns === 2 && 'sm:grid-cols-2')}>
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors',
                checked
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-sand-200 bg-white hover:border-sand-300',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange?.(option.value)}
                className="mt-1 size-5 shrink-0 accent-[--color-brand-700]"
              />
              <span className="min-w-0">
                <span className="block font-medium text-sand-900">{option.label}</span>
                {option.description ? (
                  <span className="mt-0.5 block text-sm text-sand-600">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function CheckboxCardGroup({
  legend,
  hint,
  options,
  values,
  onChange,
  max,
  columns = 2,
}: {
  legend: ReactNode;
  hint?: ReactNode;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  columns?: 1 | 2;
}) {
  const groupId = useId();
  const hintId = `${groupId}-hint`;

  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((entry) => entry !== value));
      return;
    }
    if (max && values.length >= max) return;
    onChange([...values, value]);
  }

  return (
    <fieldset aria-describedby={hint ? hintId : undefined}>
      <legend className="mb-1 text-base font-semibold text-sand-900">{legend}</legend>
      {hint ? (
        <p id={hintId} className="mb-3 text-sm text-sand-600">
          {hint}
        </p>
      ) : null}

      <div className={cn('grid gap-2', columns === 2 && 'sm:grid-cols-2')}>
        {options.map((option) => {
          const checked = values.includes(option.value);
          const blocked = !checked && max !== undefined && values.length >= max;
          return (
            <label
              key={option.value}
              className={cn(
                'flex min-h-12 items-center gap-3 rounded-lg border-2 p-3 transition-colors',
                checked ? 'border-brand-600 bg-brand-50' : 'border-sand-200 bg-white',
                blocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-sand-300',
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={blocked}
                onChange={() => toggle(option.value)}
                className="size-5 shrink-0 accent-[--color-brand-700]"
              />
              <span className="min-w-0 font-medium text-sand-900">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CheckboxRow({
  label,
  hint,
  checked,
  onChange,
  disabled,
  name,
}: {
  label: ReactNode;
  hint?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <label
      className={cn(
        'flex min-h-12 items-start gap-3 rounded-lg px-2 py-2 transition-colors',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-sand-50',
      )}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-[--color-brand-700]"
      />
      <span className="min-w-0">
        <span className={cn('block', checked && 'text-sand-500 line-through')}>{label}</span>
        {hint ? <span className="mt-0.5 block text-sm text-sand-500">{hint}</span> : null}
      </span>
    </label>
  );
}

/** Error summary shown at the top of a form, focusable for screen readers. */
export function ErrorSummary({ title, errors }: { title: string; errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div
      role="alert"
      tabIndex={-1}
      className="rounded-lg border-2 border-danger-600 bg-danger-50 p-4 text-danger-700"
    >
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export { fieldBase };
