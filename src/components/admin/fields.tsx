import React, { useState } from 'react';
import { UploadCloud, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import BlogEditor from './BlogEditor';

// ── Shared field styling helpers ───────────────────────────────────────────────

const labelCls =
  'font-sans text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] block mb-2';
const inputCls =
  'w-full bg-bg border border-charcoal/5 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all';

// ── TextField ──────────────────────────────────────────────────────────────────

export function TextField({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {textarea ? (
        <textarea
          className={`${inputCls} resize-none`}
          rows={rows}
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          type="text"
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

// ── RichTextField (TipTap HTML) ────────────────────────────────────────────────

export function RichTextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <BlogEditor value={value || ''} onChange={onChange} />
    </div>
  );
}

// ── ImageField (uploads to /api/upload) ────────────────────────────────────────

export function ImageField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Choose a PNG, JPG, GIF, SVG, or WebP image.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Image upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl border border-charcoal/5 bg-bg overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-charcoal/20" />
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 bg-white border border-charcoal/5 px-4 py-2.5 rounded-2xl text-xs font-bold cursor-pointer hover:bg-bg transition-all">
            <UploadCloud className="w-4 h-4 text-primary" />
            {uploading ? 'Uploading…' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="block text-[10px] font-bold text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          )}
          {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Repeater (add / remove / reorder a list of items) ─────────────────────────

export function Repeater({
  label,
  items: rawItems,
  onChange,
  addItem,
  renderRow,
  addLabel = 'Add item'
}: {
  label?: string;
  items: any[];
  onChange: (items: any[]) => void;
  addItem: () => any;
  renderRow: (item: any, onItemChange: (patch: any) => void, index: number) => React.ReactNode;
  addLabel?: string;
}) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const updateAt = (index: number, patch: any) => {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {label && <span className={labelCls}>{label}</span>}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="relative bg-white border border-charcoal/5 rounded-3xl p-5">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="p-1.5 rounded-lg text-charcoal/40 hover:bg-bg disabled:opacity-20 transition-colors"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="p-1.5 rounded-lg text-charcoal/40 hover:bg-bg disabled:opacity-20 transition-colors"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="pr-20 space-y-4">{renderRow(item, (patch) => updateAt(index, patch), index)}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, addItem()])}
        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-3 rounded-2xl text-xs font-bold hover:bg-primary/20 transition-all"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}
