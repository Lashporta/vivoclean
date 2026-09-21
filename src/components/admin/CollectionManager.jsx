import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ImageInput from '@/components/admin/ImageInput';

function Field({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return <Textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={field.rows || 4} placeholder={field.label} />;
    case 'number':
      return <Input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case 'url':
      return <Input type="url" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />;
    case 'image':
      return <ImageInput value={value || ''} onChange={onChange} label={field.label} />;
    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger><SelectValue placeholder={field.label} /></SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'array-text':
      return <ArrayEditor label={field.label} value={value} onChange={onChange} />;
    case 'array-object':
      return <ArrayEditor label={field.label} value={value} onChange={onChange} subFields={field.subFields} />;
    default:
      return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={field.label} />;
  }
}

export default function CollectionManager({ entityName, title, fields, queryKey, orderBy = 'order', orderLimit = 200 }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // record or {} for new
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => base44.entities[entityName].list(orderBy, orderLimit),
  });

  const blank = () => fields.reduce((acc, f) => {
    if (f.type === 'array-text' || f.type === 'array-object') acc[f.key] = [];
    else if (f.type === 'number') acc[f.key] = 0;
    else acc[f.key] = f.default ?? '';
    return acc;
  }, {});

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = fields.reduce((acc, f) => {
        if (editing[f.key] !== undefined) acc[f.key] = editing[f.key];
        return acc;
      }, {});
      if (editing.id) {
        await base44.entities[entityName].update(editing.id, payload);
      } else {
        await base44.entities[entityName].create(payload);
      }
      qc.invalidateQueries({ queryKey: [queryKey] });
      setEditing(null);
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await base44.entities[entityName].delete(id);
      qc.invalidateQueries({ queryKey: [queryKey] });
    } catch (e) {
      alert('Delete failed: ' + (e?.message || ''));
    }
  };

  const displayValue = (item, field) => {
    const v = item[field.key];
    if (field.type === 'array-text' || field.type === 'array-object') {
      return Array.isArray(v) ? `${v.length} items` : '—';
    }
    if (typeof v === 'string' && v.length > 60) return v.slice(0, 60) + '…';
    return v ?? '—';
  };

  const listFields = fields.filter((f) => !['image', 'array-text', 'array-object', 'textarea'].includes(f.type)).slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-2xl text-primary">{title}</h2>
        <Button onClick={() => setEditing(blank())}><Plus className="w-4 h-4 mr-1" /> Add new</Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 bg-foreground/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-heading text-xl text-primary">{editing.id ? 'Edit' : 'New'} {title.replace(/s$/, '')}</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-5 space-y-4">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  {f.type !== 'image' && <Label>{f.label}</Label>}
                  <Field field={f} value={editing[f.key]} onChange={(v) => setEditing((e) => ({ ...e, [f.key]: v }))} />
                </div>
              ))}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-border">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">No items yet. Click "Add new" to create one.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr>
                {listFields.map((f) => (
                  <th key={f.key} className="px-4 py-3 font-medium text-muted-foreground">{f.label}</th>
                ))}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-secondary/30">
                  {listFields.map((f) => (
                    <td key={f.key} className="px-4 py-3 text-foreground/80">{displayValue(it, f)}</td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(it)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(it.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}