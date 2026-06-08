import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Camera } from "lucide-react";

export default function GuestProfile() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { display_name: "Guest User", email: "guest@example.com", phone: "", bio: "", preferred_currency: "EUR", preferred_language: "en" }
  });

  const onSubmit = (data: any) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-primary">My Profile</h1>

      <div className="card-base p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">G</div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:brightness-110 transition-all">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-foreground">Profile photo</p>
            <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Max 5MB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input {...register("display_name")} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input {...register("email")} type="email" className="input-base bg-muted/50 cursor-not-allowed" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone number</label>
              <input {...register("phone")} type="tel" placeholder="+31 6 ..." className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Preferred currency</label>
              <select {...register("preferred_currency")} className="input-base">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea {...register("bio")} rows={3} placeholder="Tell hosts a little about yourself..." className="input-base resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">{saved ? "Saved!" : "Save changes"}</button>
            {saved && <p className="text-sm text-emerald-600 font-medium">Profile updated successfully</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
