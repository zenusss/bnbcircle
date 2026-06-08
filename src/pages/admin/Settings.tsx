import React, { useState } from "react";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

const DEFAULTS = {
  site_name: "Bnb Circle",
  footer_email: "hello@bnb-circle.com",
  footer_phone: "+31 20 123 4567",
  footer_address: "Amsterdam, Netherlands",
  copyright_text: "© 2026 Bnb Circle B.V. All rights reserved.",
  header_cta_text: "Become a host",
  header_cta_link: "/signup?as=host",
  header_cta_visible: true,
  slide_interval_ms: 5000,
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  linkedin_url: "",
};

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm({ defaultValues: DEFAULTS });
  const onSubmit = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Site Settings</h1>
        {saved && <span className="badge-green">Saved!</span>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">General</h2>
          <div><label className="block text-sm font-medium mb-1.5">Site name</label><input {...register("site_name")} className="input-base" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Copyright text</label><input {...register("copyright_text")} className="input-base" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Slide interval (ms)</label><input {...register("slide_interval_ms", { valueAsNumber: true })} type="number" className="input-base" /></div>
        </div>
        {/* Footer */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">Footer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Email</label><input {...register("footer_email")} className="input-base" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Phone</label><input {...register("footer_phone")} className="input-base" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Address</label><input {...register("footer_address")} className="input-base" /></div>
        </div>
        {/* Header CTA */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">Header CTA</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Button text</label><input {...register("header_cta_text")} className="input-base" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Button link</label><input {...register("header_cta_link")} className="input-base" /></div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("header_cta_visible")} id="cta_visible" className="w-4 h-4 accent-orange-500" />
            <label htmlFor="cta_visible" className="text-sm font-medium">Show CTA button</label>
          </div>
        </div>
        {/* Social */}
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">Social links</h2>
          <div className="grid grid-cols-2 gap-4">
            {(["instagram_url", "facebook_url", "tiktok_url", "linkedin_url"] as const).map((f) => (
              <div key={f}><label className="block text-sm font-medium mb-1.5">{f.replace("_url", "").charAt(0).toUpperCase() + f.replace("_url", "").slice(1)}</label><input {...register(f)} className="input-base" placeholder="https://..." /></div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary"><Save className="w-4 h-4" />Save settings</button>
      </form>
    </div>
  );
}
