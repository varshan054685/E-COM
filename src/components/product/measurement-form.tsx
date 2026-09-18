'use client';

import { useEffect, useRef, useState } from 'react';
import { Ruler, Upload, X } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Measurements } from '@/store/cart';

type MeasurementFormProps = {
  value: Measurements;
  onChange: (next: Measurements) => void;
  onFilesChange: (fileNames: string[]) => void;
  saveProfile: boolean;
  onSaveProfileChange: (next: boolean) => void;
  /** Field-level errors keyed by measurement name. */
  errors?: Partial<Record<'bust' | 'waist' | 'shoulder' | 'armhole', string>>;
  notes: string;
  onNotesChange: (next: string) => void;
};

const FIELDS: {
  key: 'bust' | 'waist' | 'shoulder' | 'armhole' | 'length';
  label: string;
  hint: string;
  required: boolean;
}[] = [
  { key: 'bust', label: 'Bust', hint: 'Fullest point, arms relaxed', required: true },
  { key: 'waist', label: 'Waist', hint: 'Narrowest point of the torso', required: true },
  { key: 'shoulder', label: 'Shoulder', hint: 'Shoulder tip to shoulder tip', required: true },
  { key: 'armhole', label: 'Armhole', hint: 'Around the arm at the shoulder joint', required: true },
  { key: 'length', label: 'Blouse length', hint: 'Optional — shoulder to hem', required: false },
];

type AttachedFile = { name: string; url: string };

export function MeasurementForm({
  value,
  onChange,
  onFilesChange,
  saveProfile,
  onSaveProfileChange,
  errors = {},
  notes,
  onNotesChange,
}: MeasurementFormProps) {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mirror the list into a ref so the unmount cleanup can revoke object URLs.
  const filesRef = useRef<AttachedFile[]>([]);
  filesRef.current = files;

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, []);

  function handleFiles(selected: FileList | null) {
    if (!selected || selected.length === 0) return;

    const next = [...files];
    Array.from(selected)
      .slice(0, 5)
      .forEach((file) => {
        if (next.length >= 5) return;
        if (!file.type.startsWith('image/')) return;
        next.push({ name: file.name, url: URL.createObjectURL(file) });
      });

    setFiles(next);
    onFilesChange(next.map((file) => file.name));
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    URL.revokeObjectURL(files[index].url);
    setFiles(next);
    onFilesChange(next.map((file) => file.name));
  }

  return (
    <div className="rounded-xl border border-ink-100 bg-ivory-50 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Ruler className="size-4 text-gold-600" aria-hidden="true" />
          Your measurements
        </p>

        {/* Unit toggle */}
        <div className="flex items-center rounded-md border border-ink-200 p-0.5">
          {(['in', 'cm'] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onChange({ ...value, unit })}
              aria-pressed={value.unit === unit}
              className={cn(
                'rounded px-3 py-1 text-xs font-medium uppercase transition-colors',
                value.unit === unit
                  ? 'bg-primary text-primary-foreground'
                  : 'text-ink-500 hover:text-foreground',
              )}
            >
              {unit === 'in' ? 'Inches' : 'CM'}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Measure over the inner garment you intend to wear. Our master tailor
        re-checks every set against your blouse pattern before cutting.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <Label htmlFor={`measure-${field.key}`}>
              {field.label}
              {field.required ? <span className="text-secondary">*</span> : null}
              <span className="ml-auto text-[10px] tracking-normal normal-case text-ink-300">
                {value.unit}
              </span>
            </Label>
            <Input
              id={`measure-${field.key}`}
              type="number"
              inputMode="decimal"
              min={0}
              step="0.25"
              placeholder={value.unit === 'in' ? 'e.g. 34.5' : 'e.g. 88'}
              value={value[field.key]}
              aria-invalid={Boolean(errors[field.key as keyof typeof errors])}
              onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
            />
            {errors[field.key as keyof typeof errors] ? (
              <p className="text-xs text-destructive">{errors[field.key as keyof typeof errors]}</p>
            ) : (
              <p className="text-[11px] text-ink-300">{field.hint}</p>
            )}
          </div>
        ))}
      </div>

      {/* Reference images */}
      <div className="mt-6">
        <Label htmlFor="reference-upload">Reference images</Label>
        <p className="mt-1.5 mb-3 text-[11px] text-ink-300">
          Neckline, sleeve or embroidery references — up to 5 images.
        </p>

        <input
          ref={inputRef}
          id="reference-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          className="sr-only"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={files.length >= 5}
            className="flex items-center gap-2 rounded-md border border-dashed border-ink-300 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-ink-500 uppercase transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="size-3.5" />
            Upload reference
          </button>

          <ul className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <li key={file.url} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="size-14 rounded-md border border-ink-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="absolute -top-1.5 -right-1.5 rounded-full bg-ink-900 p-0.5 text-white transition-colors hover:bg-destructive"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 flex flex-col gap-2">
        <Label htmlFor="measurement-notes">Anything else we should know?</Label>
        <Textarea
          id="measurement-notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Sleeve length, back style, lining preference, delivery date…"
          className="min-h-20 bg-card"
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-3">
        <Checkbox
          checked={saveProfile}
          onCheckedChange={(checked) => onSaveProfileChange(checked === true)}
        />
        <span className="text-xs leading-relaxed text-ink-500">
          Save these measurements to my profile for future orders
        </span>
      </label>
    </div>
  );
}
