-- ============================================================
-- BnbCircle — Schema SIMPLIFICATĂ (fără erori de duplicate)
-- Copiaza TOT si ruleaza in SQL Editor
-- ============================================================

-- Step 1: Extensii
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  bio           TEXT,
  is_host       BOOLEAN DEFAULT FALSE,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: User roles (fara enum, folosim TEXT)
CREATE TABLE IF NOT EXISTS user_roles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest','host','admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Step 4: Listings
CREATE TABLE IF NOT EXISTS listings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  slug                TEXT,
  description         TEXT,
  property_type       TEXT NOT NULL DEFAULT 'apartment',
  status              TEXT NOT NULL DEFAULT 'draft',
  city                TEXT NOT NULL DEFAULT '',
  region              TEXT,
  country             TEXT NOT NULL DEFAULT 'Netherlands',
  postal_code         TEXT,
  address             TEXT,
  latitude            FLOAT,
  longitude           FLOAT,
  bedrooms            INTEGER DEFAULT 1,
  bathrooms           INTEGER DEFAULT 1,
  max_guests          INTEGER DEFAULT 2,
  area_sqm            INTEGER,
  price_per_night     FLOAT NOT NULL DEFAULT 0,
  cleaning_fee        FLOAT DEFAULT 0,
  service_fee_percent FLOAT DEFAULT 12,
  currency            TEXT DEFAULT 'EUR',
  min_nights          INTEGER DEFAULT 1,
  max_nights          INTEGER,
  check_in_time       TEXT DEFAULT '15:00',
  check_out_time      TEXT DEFAULT '11:00',
  instant_book        BOOLEAN DEFAULT FALSE,
  featured            BOOLEAN DEFAULT FALSE,
  avg_rating          FLOAT,
  review_count        INTEGER DEFAULT 0,
  amenities           TEXT[] DEFAULT '{}',
  house_rules         TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Listing images
CREATE TABLE IF NOT EXISTS listing_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_cover    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id       UUID NOT NULL REFERENCES listings(id),
  guest_id         UUID NOT NULL REFERENCES auth.users(id),
  host_id          UUID NOT NULL REFERENCES auth.users(id),
  status           TEXT NOT NULL DEFAULT 'pending',
  check_in         DATE NOT NULL,
  check_out        DATE NOT NULL,
  guests           INTEGER NOT NULL DEFAULT 1,
  total_price      FLOAT NOT NULL DEFAULT 0,
  cleaning_fee     FLOAT DEFAULT 0,
  service_fee      FLOAT DEFAULT 0,
  special_requests TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id       UUID REFERENCES listings(id),
  booking_id       UUID REFERENCES bookings(id),
  guest_id         UUID NOT NULL REFERENCES auth.users(id),
  host_id          UUID NOT NULL REFERENCES auth.users(id),
  last_message_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Messages
CREATE TABLE IF NOT EXISTS messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        UUID NOT NULL REFERENCES auth.users(id),
  body             TEXT NOT NULL,
  status           TEXT DEFAULT 'sent',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Step 9: Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id   UUID NOT NULL REFERENCES listings(id),
  booking_id   UUID REFERENCES bookings(id),
  reviewer_id  UUID NOT NULL REFERENCES auth.users(id),
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Step 10: Slider CMS
CREATE TABLE IF NOT EXISTS slider_slides (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT,
  subtitle        TEXT,
  button_text     TEXT,
  button_link     TEXT,
  image_url       TEXT NOT NULL,
  overlay_color   TEXT DEFAULT '#0B1F3A',
  overlay_opacity FLOAT DEFAULT 0.5,
  sort_order      INTEGER DEFAULT 0,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Step 11: RLS
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_slides   ENABLE ROW LEVEL SECURITY;

-- Step 12: Politici RLS
DROP POLICY IF EXISTS "Active listings public" ON listings;
CREATE POLICY "Active listings public" ON listings FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Host manages own listings" ON listings;
CREATE POLICY "Host manages own listings" ON listings FOR ALL USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Listing images public" ON listing_images;
CREATE POLICY "Listing images public" ON listing_images FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Profiles public" ON profiles;
CREATE POLICY "Profiles public" ON profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Reviews public" ON reviews;
CREATE POLICY "Reviews public" ON reviews FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Slider public" ON slider_slides;
CREATE POLICY "Slider public" ON slider_slides FOR SELECT USING (active = TRUE);

DROP POLICY IF EXISTS "Users see own bookings" ON bookings;
CREATE POLICY "Users see own bookings" ON bookings FOR SELECT USING (auth.uid() = guest_id OR auth.uid() = host_id);

DROP POLICY IF EXISTS "Guest creates booking" ON bookings;
CREATE POLICY "Guest creates booking" ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);

DROP POLICY IF EXISTS "Involved parties see conversation" ON conversations;
CREATE POLICY "Involved parties see conversation" ON conversations FOR SELECT USING (auth.uid() = guest_id OR auth.uid() = host_id);

DROP POLICY IF EXISTS "Users see messages" ON messages;
CREATE POLICY "Users see messages" ON messages FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE guest_id = auth.uid() OR host_id = auth.uid()
  )
);

-- Step 13: Functia bootstrap
CREATE OR REPLACE FUNCTION bootstrap_current_user()
RETURNS void AS $$
DECLARE v_uid UUID := auth.uid();
BEGIN
  INSERT INTO profiles(id, email)
  VALUES(v_uid, (SELECT email FROM auth.users WHERE id = v_uid))
  ON CONFLICT DO NOTHING;

  INSERT INTO user_roles(user_id, role)
  VALUES(v_uid, 'guest')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificare finala
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
