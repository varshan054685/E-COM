'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadProductImage } from '@/lib/admin/actions';

const MAX_BYTES = 5 * 1024 * 1024;

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setError(null);

    const uploaded: string[] = [];

    for (const file of Array.from(files).slice(0, 4)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is larger than 5 MB.`);
        continue;
      }

      const result = await uploadProductImage(file);
      if (result.ok) uploaded.push(result.url);
      else setError(result.error);
    }

    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    onChange([...value, url]);
    setUrlDraft('');
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        id="product-images"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleFiles(event.target.files)}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          {busy ? 'Uploading…' : 'Upload image'}
        </Button>

        <div className="flex flex-1 items-center gap-2">
          <Input
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image URL"
            className="h-9 text-xs"
          />
          <Button type="button" variant="ghost" size="sm" onClick={addUrl}>
            Add
          </Button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}

      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {value.map((url, index) => (
            <li key={`${url}-${index}`} className="group relative">
              <span className="relative block size-20 overflow-hidden rounded-lg border border-ink-200 bg-ivory-200">
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute -top-1.5 -right-1.5 rounded-full bg-ink-900 p-1 text-white transition-colors hover:bg-destructive"
              >
                <X className="size-3" />
              </button>
              {index === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-ink-900/80 px-1.5 py-0.5 text-[9px] tracking-wide text-white uppercase">
                  Main
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          No images yet. The first image becomes the product card thumbnail.
        </p>
      )}
    </div>
  );
}
