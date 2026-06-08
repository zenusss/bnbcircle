import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { HostLayout } from "@/layouts/HostLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DemoModeSwitcher } from "@/components/DemoModeSwitcher";
import { CookieNotice } from "@/components/CookieNotice";

// ─── Lazy imports ────────────────────────────────────────────────────────────
// Public
const Home = lazy(() => import("@/pages/public/Home"));
const Search = lazy(() => import("@/pages/public/Search"));
const MapSearch = lazy(() => import("@/pages/public/MapSearch"));
const ListingDetails = lazy(() => import("@/pages/public/ListingDetails"));
const Checkout = lazy(() => import("@/pages/public/Checkout"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const OAuthCallback = lazy(() => import("@/pages/auth/OAuthCallback"));
const WriteReview = lazy(() => import("@/pages/guest/WriteReview"));

// Static/marketing
const About = lazy(() => import("@/pages/static/About"));
const FAQ = lazy(() => import("@/pages/static/FAQ"));
const Fees = lazy(() => import("@/pages/static/Fees"));
const HowItWorks = lazy(() => import("@/pages/static/HowItWorks"));
const Privacy = lazy(() => import("@/pages/static/Privacy"));
const Terms = lazy(() => import("@/pages/static/Terms"));
const Contact = lazy(() => import("@/pages/static/Contact"));
const Trust = lazy(() => import("@/pages/static/Trust"));
const Pillar = lazy(() => import("@/pages/static/Pillar"));
const Locations = lazy(() => import("@/pages/static/Locations"));
const Unsubscribe = lazy(() => import("@/pages/static/Unsubscribe"));

// Guest
const GuestDashboard = lazy(() => import("@/pages/guest/Dashboard"));
const Trips = lazy(() => import("@/pages/guest/Trips"));
const GuestRequests = lazy(() => import("@/pages/guest/Requests"));
const Favorites = lazy(() => import("@/pages/guest/Favorites"));
const GuestMessages = lazy(() => import("@/pages/guest/Messages"));
const GuestProfile = lazy(() => import("@/pages/guest/Profile"));

// Host
const HostDashboard = lazy(() => import("@/pages/host/Dashboard"));
const HostProperties = lazy(() => import("@/pages/host/Properties"));
const PropertyEditor = lazy(() => import("@/pages/host/PropertyEditor"));
const HostCalendar = lazy(() => import("@/pages/host/Calendar"));
const HostCalendarSync = lazy(() => import("@/pages/host/CalendarSync"));
const HostBookings = lazy(() => import("@/pages/host/Bookings"));
const HostMessages = lazy(() => import("@/pages/host/Messages"));
const HostReviews = lazy(() => import("@/pages/host/Reviews"));
const HostPayouts = lazy(() => import("@/pages/host/Payouts"));

// Admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminListings = lazy(() => import("@/pages/admin/Listings"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminBookings = lazy(() => import("@/pages/admin/Bookings"));
const AdminRequests = lazy(() => import("@/pages/admin/Requests"));
const AdminConversations = lazy(() => import("@/pages/admin/Conversations"));
const AdminCalendarSync = lazy(() => import("@/pages/admin/CalendarSync"));
const AdminReviews = lazy(() => import("@/pages/admin/Reviews"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminSlider = lazy(() => import("@/pages/admin/Slider"));
const AdminBranding = lazy(() => import("@/pages/admin/Branding"));
const AdminAmenities = lazy(() => import("@/pages/admin/Amenities"));
const AdminEmailTemplates = lazy(() => import("@/pages/admin/EmailTemplates"));
const AdminDesignSettings = lazy(() => import("@/pages/admin/DesignSettings"));
const AdminPropertyEditor = lazy(() => import("@/pages/admin/PropertyEditor"));

// ─── Query client ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ─── Loading spinner ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <DemoModeSwitcher />
          <CookieNotice />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public ── */}
              <Route element={<PublicLayout transparentHeader showSearch />}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route element={<PublicLayout />}>
                <Route path="/search" element={<Search />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/locations" element={<Locations />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />

                {/* Static */}
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/how-it-works/:section" element={<HowItWorks />} />
                <Route path="/pillar/:slug" element={<Pillar />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
              </Route>

              {/* Map (no footer) */}
              <Route element={<PublicLayout hideFooter />}>
                <Route path="/map" element={<MapSearch />} />
              </Route>

              {/* Checkout */}
              <Route
                path="/checkout/:id"
                element={
                  <ProtectedRoute requiredRole="guest">
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* ── Guest ── */}
              <Route
                element={
                  <ProtectedRoute requiredRole="guest">
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/app" element={<GuestDashboard />} />
                <Route path="/app/trips" element={<Trips />} />
                <Route path="/app/requests" element={<GuestRequests />} />
                <Route path="/app/favorites" element={<Favorites />} />
                <Route path="/app/messages" element={<GuestMessages />} />
                <Route path="/app/profile" element={<GuestProfile />} />
                <Route path="/app/write-review/:bookingId" element={<WriteReview />} />
              </Route>

              {/* ── Host ── */}
              <Route
                element={
                  <ProtectedRoute requiredRole="host">
                    <HostLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/host" element={<HostDashboard />} />
                <Route path="/host/properties" element={<HostProperties />} />
                <Route path="/host/properties/new" element={<PropertyEditor />} />
                <Route path="/host/properties/:id/edit" element={<PropertyEditor />} />
                <Route path="/host/calendar" element={<HostCalendar />} />
                <Route path="/host/calendar-sync" element={<HostCalendarSync />} />
                <Route path="/host/bookings" element={<HostBookings />} />
                <Route path="/host/messages" element={<HostMessages />} />
                <Route path="/host/reviews" element={<HostReviews />} />
                <Route path="/host/payouts" element={<HostPayouts />} />
              </Route>

              {/* ── Admin ── */}
              <Route
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/listings" element={<AdminListings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/conversations" element={<AdminConversations />} />
                <Route path="/admin/calendar-sync" element={<AdminCalendarSync />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/slider" element={<AdminSlider />} />
                <Route path="/admin/branding" element={<AdminBranding />} />
                <Route path="/admin/amenities" element={<AdminAmenities />} />
                <Route path="/admin/email-templates" element={<AdminEmailTemplates />} />
                <Route path="/admin/design" element={<AdminDesignSettings />} />
                <Route path="/admin/listings/new" element={<AdminPropertyEditor />} />
                <Route path="/admin/listings/:id/edit" element={<AdminPropertyEditor />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
