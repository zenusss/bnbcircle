import React, { useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";

type Block = { id: string; start: string; end: string; type: string; note: string };

const DEMO_BLOCKS: Block[] = [
  { id: "bl1", start: "2026-06-10", end: "2026-06-12", type: "maintenance", note: "Boiler service" },
  { id: "bl2", start: "2026-07-01", end: "2026-07-07", type: "unavailable", note: "Personal use" },
];

export default function HostCalendar() {
  const [blocks, setBlocks] = useState<Block[]>(DEMO_BLOCKS);
  const [form, setForm] = useState({ start: "", end: "", type: "unavailable", note: "" });

  const addBlock = () => {
    if (!form.start || !form.end) return;
    setBlocks((b) => [...b, { id: Date.now().toString(), ...form }]);
    setForm({ start: "", end: "", type: "unavailable", note: "" });
  };

  const removeBlock = (id: string) => setBlocks((b) => b.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Availability</h1>
        <p className="text-sm text-muted-foreground mt-1">Block dates when your property is unavailable</p>
      </div>

      {/* Add block form */}
      <div className="card-base p-6 space-y-4">
        <h2 className="font-bold text-primary flex items-center gap-2"><Plus className="w-4 h-4 text-accent" />Add availability block</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Start date</label>
            <input type="date" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} className="input-base text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">End date</label>
            <input type="date" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} className="input-base text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input-base text-sm">
              <option value="unavailable">Unavailable</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Note (optional)</label>
            <input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="e.g. Boiler service" className="input-base text-sm" />
          </div>
        </div>
        <button onClick={addBlock} className="btn-primary text-sm">Add block</button>
      </div>

      {/* Existing blocks */}
      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-bold text-primary">Blocked periods</h2></div>
        {blocks.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Calendar className="w-10 h-10 opacity-20 mx-auto mb-3" />
            <p className="text-sm">No blocked dates</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${b.type === "maintenance" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-600"}`}>
                    {b.type}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.start} → {b.end}</p>
                    {b.note && <p className="text-xs text-muted-foreground">{b.note}</p>}
                  </div>
                </div>
                <button onClick={() => removeBlock(b.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
