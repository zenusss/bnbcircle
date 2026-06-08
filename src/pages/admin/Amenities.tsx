import React, { useState } from "react";
import { Plus, Pencil, Trash2, Save } from "lucide-react";

const DEMO = [
  { id: "a1", name: "WiFi", icon: "wifi", category: "Connectivity" },
  { id: "a2", name: "Parking", icon: "car", category: "Parking" },
  { id: "a3", name: "Pool", icon: "waves", category: "Recreation" },
  { id: "a4", name: "Kitchen", icon: "utensils", category: "Kitchen" },
  { id: "a5", name: "Air conditioning", icon: "wind", category: "Climate" },
  { id: "a6", name: "Washer", icon: "washing-machine", category: "Laundry" },
];

export default function AdminAmenities() {
  const [amenities, setAmenities] = useState(DEMO);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "", category: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const save = () => {
    if (editId) {
      setAmenities((a) => a.map((x) => x.id === editId ? { ...x, ...form } : x));
      setEditId(null);
    } else {
      setAmenities((a) => [...a, { id: Date.now().toString(), ...form }]);
    }
    setForm({ name: "", icon: "", category: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Amenities</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", icon: "", category: "" }); }} className="btn-primary"><Plus className="w-4 h-4" />Add amenity</button>
      </div>

      {showForm && (
        <div className="card-base p-5 space-y-4 border-2 border-accent">
          <h2 className="font-bold text-primary">{editId ? "Edit amenity" : "Add amenity"}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-base" placeholder="WiFi" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Icon name</label><input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className="input-base" placeholder="wifi" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Category</label><input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-base" placeholder="Connectivity" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary text-sm"><Save className="w-4 h-4" />Save</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border"><tr>
              {["Name", "Icon", "Category", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {amenities.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
                  <td className="px-4 py-3"><code className="text-xs bg-muted px-2 py-0.5 rounded">{a.icon}</code></td>
                  <td className="px-4 py-3"><span className="badge-navy">{a.category}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditId(a.id); setForm({ name: a.name, icon: a.icon, category: a.category }); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setAmenities((x) => x.filter((i) => i.id !== a.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
