// Auto-generated Supabase database types
// Run `supabase gen types typescript` to regenerate after schema changes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          preferred_currency: string;
          preferred_language: string;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          preferred_currency?: string;
          preferred_language?: string;
          verified?: boolean;
        };
        Update: {
          display_name?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          preferred_currency?: string;
          preferred_language?: string;
          verified?: boolean;
        };
      };
      user_roles: {
        Row: { user_id: string; role: AppRole };
        Insert: { user_id: string; role: AppRole };
        Update: { role?: AppRole };
      };
      listings: {
        Row: Listing;
        Insert: ListingInsert;
        Update: Partial<ListingInsert>;
      };
      listing_images: {
        Row: ListingImage;
        Insert: ListingImageInsert;
        Update: Partial<ListingImageInsert>;
      };
      amenities: {
        Row: Amenity;
        Insert: { name: string; icon: string | null; category: string | null };
        Update: { name?: string; icon?: string | null; category?: string | null };
      };
      listing_amenities: {
        Row: { listing_id: string; amenity_id: string };
        Insert: { listing_id: string; amenity_id: string };
        Update: Record<string, never>;
      };
      bookings: {
        Row: Booking;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
      };
      availability_blocks: {
        Row: AvailabilityBlock;
        Insert: Omit<AvailabilityBlock, "id" | "created_at">;
        Update: Partial<Omit<AvailabilityBlock, "id" | "created_at">>;
      };
      reviews: {
        Row: Review;
        Insert: ReviewInsert;
        Update: Partial<ReviewInsert>;
      };
      favorites: {
        Row: { user_id: string; listing_id: string; created_at: string };
        Insert: { user_id: string; listing_id: string };
        Update: Record<string, never>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Conversation, "id" | "created_at">>;
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          user_id: string;
          last_read_at: string | null;
          joined_at: string;
        };
        Insert: { conversation_id: string; user_id: string };
        Update: { last_read_at?: string | null };
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
      };
      availability_requests: {
        Row: AvailabilityRequest;
        Insert: AvailabilityRequestInsert;
        Update: Partial<AvailabilityRequestInsert>;
      };
      ical_calendars: {
        Row: ICalCalendar;
        Insert: Omit<ICalCalendar, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ICalCalendar, "id" | "created_at">>;
      };
      ical_events: {
        Row: ICalEvent;
        Insert: Omit<ICalEvent, "id">;
        Update: Partial<Omit<ICalEvent, "id">>;
      };
      payouts: {
        Row: Payout;
        Insert: Omit<Payout, "id" | "created_at">;
        Update: Partial<Omit<Payout, "id" | "created_at">>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings>;
        Update: Partial<SiteSettings>;
      };
      homepage_slides: {
        Row: HomepageSlide;
        Insert: Omit<HomepageSlide, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<HomepageSlide, "id" | "created_at">>;
      };
      email_templates: {
        Row: EmailTemplate;
        Insert: Omit<EmailTemplate, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<EmailTemplate, "id" | "created_at">>;
      };
    };
    Views: {
      public_profiles: {
        Row: { user_id: string; display_name: string; avatar_url: string | null };
      };
    };
    Functions: {
      has_role: {
        Args: { uid: string; role: AppRole };
        Returns: boolean;
      };
      bootstrap_current_user: {
        Args: Record<string, never>;
        Returns: void;
      };
      request_host_role: {
        Args: Record<string, never>;
        Returns: void;
      };
      check_availability: {
        Args: {
          p_listing_id: string;
          p_check_in: string;
          p_check_out: string;
          p_exclude_booking_id?: string;
        };
        Returns: boolean;
      };
      get_booking_host_notes: {
        Args: { p_booking_id: string };
        Returns: string | null;
      };
    };
    Enums: {
      app_role: AppRole;
      listing_status: ListingStatus;
      property_type: PropertyType;
      booking_status: BookingStatus;
      conversation_status: ConversationStatus;
      availability_request_status: AvailabilityRequestStatus;
    };
  };
};

// ===== ENUMS =====
export type AppRole = "guest" | "host" | "admin";
export type ListingStatus = "draft" | "pending_review" | "active" | "inactive";
export type PropertyType = "apartment" | "house" | "villa" | "studio" | "cabin" | "other";
export type BookingStatus =
  | "pending"
  | "confirmed_by_host"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed"
  | "no_show"
  | "expired";
export type ConversationStatus = "active" | "needs_attention" | "escalated" | "resolved";
export type AvailabilityRequestStatus =
  | "pending"
  | "answered"
  | "suggested"
  | "declined"
  | "converted";

// ===== ENTITY TYPES =====
export interface Listing {
  id: string;
  host_id: string;
  title: string;
  slug: string;
  description: string;
  property_type: PropertyType;
  status: ListingStatus;
  city: string;
  region: string | null;
  country: string;
  postal_code: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  area_sqm: number | null;
  price_per_night: number;
  cleaning_fee: number;
  service_fee_percent: number;
  currency: string;
  min_nights: number;
  max_nights: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  instant_book: boolean;
  featured: boolean;
  avg_rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = Omit<
  Listing,
  "id" | "created_at" | "updated_at" | "avg_rating" | "review_count" | "slug"
> & { slug?: string };

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export type ListingImageInsert = Omit<ListingImage, "id" | "created_at">;

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  host_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  nights: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  currency: string;
  status: BookingStatus;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  guest_message: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BookingInsert = {
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  guest_message?: string | null;
};

export interface Review {
  id: string;
  booking_id: string;
  listing_id: string;
  reviewer_id: string;
  rating: number;
  cleanliness: number | null;
  accuracy: number | null;
  communication: number | null;
  location: number | null;
  value: number | null;
  comment: string;
  host_response: string | null;
  host_responded_at: string | null;
  is_visible: boolean;
  moderation_status: string;
  created_at: string;
}

export type ReviewInsert = Omit<Review, "id" | "created_at" | "host_response" | "host_responded_at" | "is_visible" | "moderation_status">;

export interface AvailabilityBlock {
  id: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  block_type: string;
  note: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string | null;
  booking_id: string | null;
  availability_request_id: string | null;
  created_by: string;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  read: boolean;
  created_at: string;
}

export type MessageInsert = {
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: string;
};

export interface AvailabilityRequest {
  id: string;
  listing_id: string;
  user_id: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  guests_count: number;
  message: string | null;
  status: AvailabilityRequestStatus;
  admin_notes: string | null;
  suggested_listing_id: string | null;
  created_at: string;
  updated_at: string;
}

export type AvailabilityRequestInsert = Omit<
  AvailabilityRequest,
  "id" | "created_at" | "updated_at" | "status" | "admin_notes" | "suggested_listing_id"
>;

export interface ICalCalendar {
  id: string;
  listing_id: string;
  name: string;
  ical_url: string;
  is_enabled: boolean;
  last_sync_at: string | null;
  last_success_at: string | null;
  sync_status: string;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICalEvent {
  id: string;
  calendar_id: string;
  uid: string;
  summary: string | null;
  start_date: string;
  end_date: string;
  raw_data: Json;
}

export interface Payout {
  id: string;
  host_id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  stripe_transfer_id: string | null;
  payout_date: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  logo_url: string | null;
  logo_dark_url: string | null;
  footer_text: string | null;
  footer_email: string | null;
  footer_phone: string | null;
  footer_address: string | null;
  copyright_text: string | null;
  header_cta_text: string | null;
  header_cta_link: string | null;
  header_cta_visible: boolean;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  slide_interval_ms: number;
  updated_at: string;
}

export interface HomepageSlide {
  id: string;
  image_url: string | null;
  video_url: string | null;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  overlay_color: string;
  overlay_opacity: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  body: string;
  edited_by: string | null;
  created_at: string;
  updated_at: string;
}
