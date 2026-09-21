import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingsView() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => base44.entities.BookingRequest.list('-created_date', 200),
  });

  const setStatus = async (id, status) => {
    try {
      await base44.entities.BookingRequest.update(id, { status });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    } catch (e) {
      alert('Update failed: ' + (e?.message || ''));
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this request?')) return;
    try {
      await base44.entities.BookingRequest.delete(id);
      qc.invalidateQueries({ queryKey: ['bookings'] });
    } catch (e) {
      alert('Delete failed: ' + (e?.message || ''));
    }
  };

  if (isLoading) return <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  if (items.length === 0) return <p className="text-muted-foreground py-8 text-center">No quote requests yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div key={b.id} className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-heading text-lg text-primary">{b.name}</p>
              <p className="text-sm text-muted-foreground">{new Date(b.created_date).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={b.status || 'new'} onValueChange={(v) => setStatus(b.id, v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => remove(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${b.email}`} className="text-primary hover:underline inline-flex items-center gap-1"><Mail className="w-3 h-3" />{b.email}</a></p>
            {b.phone && <p><span className="text-muted-foreground">Phone:</span> {b.phone}</p>}
            {b.service && <p><span className="text-muted-foreground">Service:</span> {b.service}</p>}
            {b.address && <p><span className="text-muted-foreground">Address:</span> {b.address}</p>}
            {b.preferred_time && <p><span className="text-muted-foreground">Preferred time:</span> {b.preferred_time}</p>}
            {b.has_vacuum && <p><span className="text-muted-foreground">Own vacuum:</span> {b.has_vacuum}</p>}
            {b.promo_code && <p><span className="text-muted-foreground">Promo:</span> {b.promo_code}</p>}
          </div>
          {b.message && <p className="mt-3 text-sm text-foreground/80 bg-secondary/50 rounded p-3">{b.message}</p>}
        </div>
      ))}
    </div>
  );
}