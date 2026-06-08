import React from "react";
import { Save, Upload } from "lucide-react";
import { useForm } from "react-hook-form";

export default function AdminBranding() {
  const { register, handleSubmit } = useForm({
    defaultValues: { site_name: "Bnb Circle", support_email: "hello@bnb-circle.com", logo_url: "", logo_dark_url: "", copyright_text: "© 2026 Bnb Circle B.V.", instagram_url: "", facebook_url: "" }
  });
  const onSubmit = (data: any) => console.log("Save branding", data);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-primary">Branding</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">Logo</h2>
          <div className="grid grid-cols-2 gap-6">
            {[{ field: "logo_url", label: "Light mode logo", bg: "bg-white border" }, { field: "logo_dark_url", label: "Dark mode logo", bg: "bg-primary" }].map(({ field, label, bg }) => (
              <div key={field}>
                <p className="text-sm font-medium mb-2">{label}</p>
                <div className={`${bg} rounded-xl p-4 h-24 flex items-center justify-center mb-2`}>
                  <Upload className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <input {...register(field as any)} className="input-base text-sm" placeholder="https://..." />
              </div>
            ))}
          </div>
        </div>
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">Brand info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Site name</label><input {...register("site_name")} className="input-base" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Support email</label><input {...register("support_email")} className="input-base" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Copyright</label><input {...register("copyright_text")} className="input-base" /></div>
        </div>
        <div className="card-base p-6 space-y-4">
          <h2 className="font-bold text-primary">Social links</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Instagram</label><input {...register("instagram_url")} className="input-base" placeholder="https://instagram.com/..." /></div>
            <div><label className="block text-sm font-medium mb-1.5">Facebook</label><input {...register("facebook_url")} className="input-base" placeholder="https://facebook.com/..." /></div>
          </div>
        </div>
        <button type="submit" className="btn-primary"><Save className="w-4 h-4" />Save branding</button>
      </form>
    </div>
  );
}
