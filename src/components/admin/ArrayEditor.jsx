import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Edits an array of strings OR an array of objects.
// For objects, pass `subFields` = [{ key, label, type: 'text'|'textarea' }]
export default function ArrayEditor({ label, value = [], onChange, subFields }) {
  const items = Array.isArray(value) ? value : [];

  const update = (i, patch) => {
    const next = items.map((it, idx) => (idx === i ? (subFields ? { ...it, ...patch } : patch) : it));
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => {
    if (subFields) {
      const blank = subFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});
      onChange([...items, blank]);
    } else {
      onChange([...items, '']);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start rounded-md border border-border p-3 bg-secondary/40">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-2 shrink-0" />
            <div className="flex-1 space-y-2">
              {subFields ? (
                subFields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    {f.type === 'textarea' ? (
                      <Textarea
                        value={it[f.key] || ''}
                        onChange={(e) => update(i, { [f.key]: e.target.value })}
                        placeholder={f.label}
                        rows={2}
                      />
                    ) : (
                      <Input
                        value={it[f.key] || ''}
                        onChange={(e) => update(i, { [f.key]: e.target.value })}
                        placeholder={f.label}
                      />
                    )}
                  </div>
                ))
              ) : (
                <Input
                  value={typeof it === 'string' ? it : ''}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder={`${label || 'Item'} ${i + 1}`}
                />
              )}
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="shrink-0">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Add item
      </Button>
    </div>
  );
}