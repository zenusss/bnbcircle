import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Mail,
  Clock,
  Eye,
  Search,
  Filter,
  CalendarDays,
  Users,
  Home,
  Send,
  X,
  AlertTriangle,
  Star,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

type RequestStatus = "pending" | "approved" | "declined" | "suggested";

interface BookingRequest {
  id: string;
  guest: string;
  email: string;
  phone?: string;
  listing: string;
  listingCity: string;
  listingImage: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  message?: string;
  status: RequestStatus;
  submitted: string;
}

// ─── Demo data ──────────────────────────────────────────────────────────────

const DEMO_REQUESTS: BookingRequest[] = [
  {
    id: "r1",
    guest: "Emma Johnson",
    email: "emma.johnson@gmail.com",
    phone: "+31 6 12345678",
    listing: "Canal House Amsterdam",
    listingCity: "Amsterdam",
    listingImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&h=80&fit=crop",
    pricePerNight: 185,
    checkIn: "2026-07-10",
    checkOut: "2026-07-15",
    nights: 5,
    guests: 2,
    totalPrice: 925,
    message: "Bună ziua! Suntem un cuplu din UK și vrem să vizităm Amsterdamul în iulie. Am citit recenziile proprietății și ni se pare perfectă. Este posibil să facem check-in mai devreme, în jurul orei 12:00?",
    status: "pending",
    submitted: "2026-06-08",
  },
  {
    id: "r2",
    guest: "Lars Petersen",
    email: "lars.petersen@outlook.com",
    phone: "+45 20 123456",
    listing: "Zeeland Beach Villa",
    listingCity: "Middelburg",
    listingImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=120&h=80&fit=crop",
    pricePerNight: 420,
    checkIn: "2026-08-10",
    checkOut: "2026-08-17",
    nights: 7,
    guests: 6,
    totalPrice: 2940,
    message: "Suntem o familie cu 4 copii din Danemarca. Căutăm o vacanță la mare. Este plaja accesibilă pentru copii mici?",
    status: "pending",
    submitted: "2026-06-07",
  },
  {
    id: "r3",
    guest: "Sophie Martin",
    email: "sophie.martin@email.fr",
    listing: "Modern Apartment Vondelpark",
    listingCity: "Amsterdam",
    listingImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=120&h=80&fit=crop",
    pricePerNight: 95,
    checkIn: "2026-06-20",
    checkOut: "2026-06-25",
    nights: 5,
    guests: 2,
    totalPrice: 475,
    status: "approved",
    submitted: "2026-06-05",
  },
  {
    id: "r4",
    guest: "Marco Rossi",
    email: "marco.rossi@libero.it",
    listing: "Luxury Cabin Veluwe",
    listingCity: "Apeldoorn",
    listingImage: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=120&h=80&fit=crop",
    pricePerNight: 210,
    checkIn: "2026-07-01",
    checkOut: "2026-07-05",
    nights: 4,
    guests: 4,
    totalPrice: 840,
    message: "Avem nevoie de parcare pentru 2 mașini.",
    status: "declined",
    submitted: "2026-06-01",
  },
];

// ─── Email templates ────────────────────────────────────────────────────────

function buildApprovalEmail(req: BookingRequest): string {
  const checkInFormatted = new Date(req.checkIn).toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const checkOutFormatted = new Date(req.checkOut).toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return `Subiect: ✅ Rezervarea ta la "${req.listing}" a fost CONFIRMATĂ!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🏡 BnbCircle — Confirmare Rezervare
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dragă ${req.guest.split(" ")[0]},

🎉 Felicitări! Cererea ta de rezervare a fost APROBATĂ!

Suntem încântați să te anunțăm că proprietatea "${req.listing}" 
din ${req.listingCity} este disponibilă pentru perioada solicitată 
și rezervarea ta a fost confirmată oficial.

────────────────────────────────────────
📋 DETALIILE REZERVĂRII TALE
────────────────────────────────────────

  🏠 Proprietate:    ${req.listing}
  📍 Locație:        ${req.listingCity}, Olanda
  📅 Check-in:       ${checkInFormatted}
                     (Check-in: după ora 15:00)
  📅 Check-out:      ${checkOutFormatted}
                     (Check-out: înainte de ora 11:00)
  🌙 Durata:         ${req.nights} nopți
  👥 Oaspeți:        ${req.guests} persoane
  💶 Total:          €${req.totalPrice.toLocaleString()} (${req.nights} × €${req.pricePerNight}/noapte)

────────────────────────────────────────
📌 CE URMEAZĂ?
────────────────────────────────────────

  1. ✅ Vei primi în scurt timp instrucțiunile de check-in
     și codul de acces la proprietate.

  2. 📱 Gazda te va contacta cu 24h înainte de sosire
     pentru a confirma ora exactă de check-in.

  3. 💳 Plata se va efectua la sosire sau conform
     metodei agreate la rezervare.

  4. 📞 Pentru orice întrebare, contactează-ne la:
     support@bnb-circle.com

────────────────────────────────────────
💡 SFATURI PENTRU ȘEDEREA TA
────────────────────────────────────────

  • Verifică prognoza meteo pentru ${req.listingCity} înainte de plecare
  • Adresa exactă și instrucțiunile de parcare îți vor fi 
    trimise cu 48h înainte de check-in
  • Dacă ai nevoie de recomandări locale (restaurante, 
    activități), gazda ta cu plăcere te va ajuta!

Ne dorim o ședere minunată și de neuitat! 🌷

Cu drag,
Echipa BnbCircle
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
www.bnb-circle.com | support@bnb-circle.com
Pentru a te dezabona: click here`;
}

function buildDeclineEmail(req: BookingRequest, reason: string): string {
  const checkInFormatted = new Date(req.checkIn).toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const checkOutFormatted = new Date(req.checkOut).toLocaleDateString("ro-RO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return `Subiect: ℹ️ Actualizare cerere rezervare — "${req.listing}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🏡 BnbCircle — Informare Cerere Rezervare
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dragă ${req.guest.split(" ")[0]},

Îți mulțumim că ai ales BnbCircle și că ți-ai manifestat 
interesul pentru proprietatea noastră "${req.listing}".

Din păcate, trebuie să te informăm că cererea ta de rezervare 
pentru perioada solicitată nu a putut fi aprobată.

────────────────────────────────────────
📋 CEREREA TA
────────────────────────────────────────

  🏠 Proprietate:    ${req.listing}
  📍 Locație:        ${req.listingCity}, Olanda
  📅 Perioada:       ${checkInFormatted}
                     → ${checkOutFormatted}
  👥 Oaspeți:        ${req.guests} persoane

────────────────────────────────────────
❌ MOTIVUL INDISPONIBILITĂȚII
────────────────────────────────────────

  ${reason || "Proprietatea nu este disponibilă pentru perioada solicitată din cauza unei rezervări existente."}

────────────────────────────────────────
🔍 CE POȚI FACE ACUM?
────────────────────────────────────────

  Nu te descuraja! Avem multe alte proprietăți 
  minunate disponibile:

  1. 🔎 Caută alte date disponibile pentru aceeași 
     proprietate pe www.bnb-circle.com

  2. 🏡 Explorează proprietăți similare în ${req.listingCity}
     sau în alte orașe din Olanda

  3. 📧 Contactează-ne la support@bnb-circle.com și 
     te vom ajuta să găsești alternativa perfectă

  4. 🔔 Activează alertele de disponibilitate pentru 
     a fi notificat când proprietatea devine liberă

────────────────────────────────────────
💬 FEEDBACK-UL TĂU CONTEAZĂ
────────────────────────────────────────

  Ne pare sincer rău că nu putem onora această cerere.
  Dacă dorești să ne contactezi pentru mai multe detalii 
  sau alternative, suntem disponibili 24/7.

  Email: support@bnb-circle.com
  Telefon: +31 20 123 4567

Sperăm să te putem servi în viitor!

Cu stimă,
Echipa BnbCircle
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
www.bnb-circle.com | support@bnb-circle.com
Pentru a te dezabona: click here`;
}

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: { label: "În așteptare", cls: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  approved: { label: "Aprobat", cls: "bg-green-100 text-green-700", dot: "bg-green-500" },
  declined: { label: "Refuzat", cls: "bg-red-100 text-red-700", dot: "bg-red-500" },
  suggested: { label: "Sugestie trimisă", cls: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
};

// ─── Email Preview Modal ────────────────────────────────────────────────────

interface EmailModalProps {
  request: BookingRequest;
  type: "approve" | "decline";
  declineReason: string;
  onSend: () => void;
  onClose: () => void;
}

function EmailModal({ request, type, declineReason, onSend, onClose }: EmailModalProps) {
  const emailContent = type === "approve"
    ? buildApprovalEmail(request)
    : buildDeclineEmail(request, declineReason);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={cn(
          "px-6 py-4 flex items-center justify-between shrink-0",
          type === "approve" ? "bg-green-50 border-b border-green-200" : "bg-red-50 border-b border-red-200"
        )}>
          <div className="flex items-center gap-3">
            {type === "approve"
              ? <CheckCircle className="w-6 h-6 text-green-600" />
              : <XCircle className="w-6 h-6 text-red-600" />}
            <div>
              <h3 className="font-bold text-foreground">
                {type === "approve" ? "Confirmare rezervare" : "Refuzare cerere"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Previzualizare email → {request.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-50 rounded-xl border border-border p-4">
            <pre className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">
              {emailContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between shrink-0">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Email va fi trimis la: <span className="font-semibold text-foreground">{request.email}</span>
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors">
              Anulează
            </button>
            <button onClick={onSend}
              className={cn(
                "px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 text-white transition-all",
                type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              )}>
              <Send className="w-4 h-4" />
              {type === "approve" ? "Aprobă & Trimite Email" : "Refuză & Trimite Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Request Detail Panel ───────────────────────────────────────────────────

interface RequestPanelProps {
  request: BookingRequest;
  onApprove: () => void;
  onDecline: () => void;
  onClose: () => void;
}

function RequestPanel({ request, onApprove, onDecline, onClose }: RequestPanelProps) {
  const nights = request.nights;
  const statusCfg = STATUS_CONFIG[request.status];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-end p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background px-6 py-4 border-b border-border flex items-center justify-between z-10">
          <h3 className="font-bold text-lg text-foreground">Detalii cerere</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Listing */}
          <div className="flex gap-3">
            <img src={request.listingImage} alt={request.listing}
              className="w-20 h-14 rounded-xl object-cover shrink-0" />
            <div>
              <p className="font-bold text-foreground">{request.listing}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {request.listingCity}
              </p>
              <div className={cn("mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", statusCfg.cls)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                {statusCfg.label}
              </div>
            </div>
          </div>

          {/* Guest info */}
          <div className="card-base p-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Oaspete</p>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                {request.guest.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{request.guest}</p>
                <p className="text-xs text-muted-foreground">{request.email}</p>
              </div>
            </div>
            {request.phone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {request.phone}
              </p>
            )}
          </div>

          {/* Booking details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-base p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Check-in</p>
              <p className="font-semibold text-sm">{new Date(request.checkIn).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="card-base p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Check-out</p>
              <p className="font-semibold text-sm">{new Date(request.checkOut).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="card-base p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Nopți</p>
              <p className="font-semibold text-sm">{nights} nopți</p>
            </div>
            <div className="card-base p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Persoane</p>
              <p className="font-semibold text-sm">{request.guests} oaspeți</p>
            </div>
          </div>

          {/* Price */}
          <div className="card-base p-4 bg-accent/5 border-accent/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{nights} nopți × €{request.pricePerNight}</span>
              <span className="text-xl font-bold text-accent">€{request.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="card-base p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Mesaj oaspete</p>
              <p className="text-sm text-foreground italic leading-relaxed">"{request.message}"</p>
            </div>
          )}

          {/* Submitted */}
          <p className="text-xs text-muted-foreground">
            Cerere primită: {new Date(request.submitted).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          {/* Actions */}
          {request.status === "pending" && (
            <div className="flex gap-3 pt-2">
              <button onClick={onDecline}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors">
                <XCircle className="w-4 h-4" />
                Refuză
              </button>
              <button onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                <CheckCircle className="w-4 h-4" />
                Aprobă
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function AdminRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>(DEMO_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [emailModal, setEmailModal] = useState<{ request: BookingRequest; type: "approve" | "decline" } | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);

  // Stats
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const declined = requests.filter((r) => r.status === "declined").length;

  // Filtered
  const filtered = requests.filter((r) => {
    const matchSearch = !search ||
      r.guest.toLowerCase().includes(search.toLowerCase()) ||
      r.listing.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openApprove(req: BookingRequest) {
    setSelectedRequest(null);
    setEmailModal({ request: req, type: "approve" });
  }

  function openDecline(req: BookingRequest) {
    setSelectedRequest(null);
    setShowDeclineInput(true);
    setEmailModal({ request: req, type: "decline" });
  }

  function handleSendEmail() {
    if (!emailModal) return;
    const { request, type } = emailModal;
    const newStatus: RequestStatus = type === "approve" ? "approved" : "declined";
    setRequests((prev) =>
      prev.map((r) => r.id === request.id ? { ...r, status: newStatus } : r)
    );
    setEmailModal(null);
    setDeclineReason("");
    setShowDeclineInput(false);
    toast.success(
      type === "approve"
        ? `✅ Rezervare aprobată! Email trimis la ${request.email}`
        : `❌ Cerere refuzată. Email trimis la ${request.email}`,
      { duration: 4000 }
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cereri de Rezervare</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestionează și răspunde cererilor de disponibilitate</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pending}</p>
            <p className="text-xs text-muted-foreground">În așteptare</p>
          </div>
        </div>
        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{approved}</p>
            <p className="text-xs text-muted-foreground">Aprobate</p>
          </div>
        </div>
        <div className="card-base p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{declined}</p>
            <p className="text-xs text-muted-foreground">Refuzate</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="input-base pl-9 w-full"
            placeholder="Caută oaspete, proprietate…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-base w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Toate statusurile</option>
          <option value="pending">În așteptare</option>
          <option value="approved">Aprobate</option>
          <option value="declined">Refuzate</option>
        </select>
      </div>

      {/* Request cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-base p-16 text-center text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-medium">Nicio cerere găsită</p>
          </div>
        ) : (
          filtered.map((req) => {
            const statusCfg = STATUS_CONFIG[req.status];
            return (
              <div key={req.id}
                className={cn(
                  "card-base p-4 transition-all hover:shadow-md",
                  req.status === "pending" && "border-l-4 border-l-amber-400"
                )}>
                <div className="flex items-start gap-4">
                  {/* Listing image */}
                  <img src={req.listingImage} alt={req.listing}
                    className="w-16 h-12 rounded-xl object-cover shrink-0 hidden sm:block" />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground">{req.guest}</span>
                          <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", statusCfg.cls)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                            {statusCfg.label}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{req.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {new Date(req.submitted).toLocaleDateString("ro-RO")}
                      </p>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Home className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium text-foreground">{req.listing}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(req.checkIn).toLocaleDateString("ro-RO", { day: "numeric", month: "short" })} →{" "}
                        {new Date(req.checkOut).toLocaleDateString("ro-RO", { day: "numeric", month: "short" })}
                        <span className="text-xs">({req.nights} nopți)</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {req.guests} pers.
                      </span>
                      <span className="font-bold text-accent">€{req.totalPrice.toLocaleString()}</span>
                    </div>

                    {req.message && (
                      <p className="mt-2 text-xs text-muted-foreground italic truncate max-w-lg">
                        💬 "{req.message}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                      title="Vezi detalii"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => openDecline(req)}
                          className="px-3 py-2 rounded-lg border-2 border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Refuză
                        </button>
                        <button
                          onClick={() => openApprove(req)}
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Aprobă
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Decline reason input */}
      {emailModal?.type === "decline" && showDeclineInput && (
        <div className="fixed inset-0 z-45 flex items-center justify-center p-4" style={{ zIndex: 45 }}>
          <div className="absolute inset-0 bg-black/50" onClick={() => { setEmailModal(null); setShowDeclineInput(false); }} />
          <div className="relative card-base p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-foreground">Motiv refuzare</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Adaugă un motiv pentru refuzarea cererii (opțional — apare în email):
            </p>
            <textarea
              className="input-base w-full h-24 resize-none"
              placeholder="Ex: Proprietatea este rezervată deja pentru această perioadă. Vă recomandăm să verificați disponibilitatea pentru alte date..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => { setEmailModal(null); setShowDeclineInput(false); }}
                className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                Anulează
              </button>
              <button
                onClick={() => setShowDeclineInput(false)}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Previzualizează email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request detail panel */}
      {selectedRequest && (
        <RequestPanel
          request={selectedRequest}
          onApprove={() => openApprove(selectedRequest)}
          onDecline={() => openDecline(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {/* Email preview modal */}
      {emailModal && !showDeclineInput && (
        <EmailModal
          request={emailModal.request}
          type={emailModal.type}
          declineReason={declineReason}
          onSend={handleSendEmail}
          onClose={() => { setEmailModal(null); setDeclineReason(""); }}
        />
      )}
    </div>
  );
}
