"use client";

import { useState } from "react";

export type WorkshopForm = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO local
  capacity: number;
};

type Props = {
  open: boolean;
  initial: WorkshopForm;
  onClose: () => void;
  onSaved: (updated: WorkshopForm) => void;
};

export default function EditModal({ open, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function save() {
    setSaving(true);
    try {
      // TODO: implementar PATCH /api/talleres/{id}
      onSaved(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white border shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold">Editar taller</h2>
        <input className="input w-full" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
        <input className="input w-full" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
          <input className="input" type="number" value={form.capacity} onChange={(e)=>setForm({...form, capacity:Number(e.target.value)})} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-outline px-3 py-1.5">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn btn-primary px-3 py-1.5">{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </div>
  );
}
