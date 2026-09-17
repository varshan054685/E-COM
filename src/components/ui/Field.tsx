'use client';

import { cloneElement, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

/**
 * Composable field wrapper: renders a label (wired to the child input via id),
 * the child control itself, and hint/error text.
 * Usage: <Field label="Email" required><Input … /></Field>
 */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldProps & { children: React.ReactElement<{ id?: string; 'aria-invalid'?: boolean }>; className?: string }) {
  const autoId = useId();
  const id = children.props.id || autoId;
  const child = cloneElement(children, {
    id,
    ...(error ? { 'aria-invalid': true } : {}),
  });
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium tracking-wide text-charcoal-700">
          {label}
          {required && <span className="text-gold-600 ml-0.5">*</span>}
        </label>
      )}
      {child}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const fieldBase =
  'w-full h-11 px-4 text-sm bg-ivory-50 border border-ink/15 text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink/40 focus:ring-2 focus:ring-gold-500/20 transition rounded-none';

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & FieldProps
>(function Input({ className, label, hint, error, required, id, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium tracking-wide text-charcoal-700">
          {label}
          {required && <span className="text-gold-600 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        required={required}
        className={cn(fieldBase, error && 'border-red-400', className)}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ className, label, hint, error, required, id, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium tracking-wide text-charcoal-700">
          {label}
          {required && <span className="text-gold-600 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        required={required}
        className={cn(fieldBase, 'h-auto py-3 min-h-[96px] resize-y', error && 'border-red-400', className)}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(function Select({ className, label, hint, error, required, id, children, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium tracking-wide text-charcoal-700">
          {label}
          {required && <span className="text-gold-600 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        required={required}
        className={cn(fieldBase, 'appearance-none pr-10 cursor-pointer', error && 'border-red-400', className)}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none -mt-8 relative float-right h-0 w-0" />
    </div>
  );
});

export function SearchInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
      <input className={cn(fieldBase, 'pl-11')} {...props} />
    </div>
  );
}