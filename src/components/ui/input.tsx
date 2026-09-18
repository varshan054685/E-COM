import * as React from 'react';

import { cn } from '@/lib/utils';

const fieldClasses =
  'w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-ink-300 hover:border-ink-300 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive';

function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return <input type={type} className={cn(fieldClasses, 'h-11', className)} {...props} />;
}

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea className={cn(fieldClasses, 'min-h-24 resize-y', className)} {...props} />;
}

export { Input, Textarea, fieldClasses };
