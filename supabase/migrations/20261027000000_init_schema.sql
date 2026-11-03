-- Create Enum Types
CREATE TYPE user_role AS ENUM ('student', 'owner_admin', 'assistant_admin');
CREATE TYPE enrollment_status AS ENUM ('null', 'pending', 'verified', 'rejected');
CREATE TYPE gender_type AS ENUM ('male', 'female');

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  gender gender_type,
  phone_number VARCHAR(20) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  profile_photo_url TEXT DEFAULT 'default-avatar.jpg',
  role user_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  instructor_name VARCHAR(255) DEFAULT 'Finot Team',
  enrolled_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MODULES TABLE
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ENROLLMENTS TABLE
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  unique_student_id VARCHAR(50) UNIQUE NOT NULL,
  payment_receipt_url TEXT NOT NULL,
  status enrollment_status DEFAULT 'pending',
  rejection_reason TEXT,
  progress_percentage INT DEFAULT 0,
  capstone_project_url TEXT,
  capstone_approved BOOLEAN DEFAULT false,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CERTIFICATES TABLE
CREATE TABLE public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_code VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_pdf_url TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_audience VARCHAR(50) DEFAULT 'all', -- 'all', 'enrolled', 'rejected'
  is_pinned_banner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automatic Counter Trigger for Enrolled Count Increment
CREATE OR REPLACE FUNCTION increment_course_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' AND (OLD.status IS NULL OR OLD.status != 'verified') THEN
    UPDATE public.courses
    SET enrolled_count = enrolled_count + 1
    WHERE id = NEW.course_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_enrollment
AFTER UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION increment_course_enrollment();

-- 1. profiles ሰንጠረዥ ላይ username መጨመር
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;

-- 2. የአድሚኑን አካውንት ወደ owner_admin እና Username ወደ FinotOwner መቀየር
-- (ማሳሰቢያ፡ 'YOUR_ADMIN_EMAIL@gmail.com' በሚለው ቦታ እውነተኛ የአድሚን ኢሜይል ተኩ)
UPDATE public.profiles 
SET role = 'owner_admin', username = 'FinotOwner'
WHERE email = 'YOUR_ADMIN_EMAIL@gmail.com';

-- 1. Create Enum Types
CREATE TYPE user_role AS ENUM ('student', 'owner_admin', 'assistant_admin');
CREATE TYPE enrollment_status AS ENUM ('null', 'pending', 'verified', 'rejected');
CREATE TYPE gender_type AS ENUM ('male', 'female');

-- 2. PROFILES TABLE (Updated for Signup Flow)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  unique_student_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  username VARCHAR(100) UNIQUE,
  gender gender_type,
  phone_number VARCHAR(20) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  profile_photo_url TEXT DEFAULT 'default-avatar.jpg',
  role user_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COURSES TABLE
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  instructor_name VARCHAR(255) DEFAULT 'Finot Team',
  enrolled_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MODULES TABLE
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ENROLLMENTS TABLE
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  unique_student_id VARCHAR(50) NOT NULL,
  payment_receipt_url TEXT NOT NULL,
  status enrollment_status DEFAULT 'pending',
  rejection_reason TEXT,
  progress_percentage INT DEFAULT 0,
  capstone_project_url TEXT,
  capstone_approved BOOLEAN DEFAULT false,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 6. CERTIFICATES TABLE
CREATE TABLE public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_code VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_pdf_url TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_audience VARCHAR(50) DEFAULT 'all', -- 'all', 'enrolled', 'rejected'
  is_pinned_banner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. AUTOMATIC TRIGGER FOR SIGNUP PROFILE CREATION & UNIQUE ID GENERATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_id VARCHAR(50);
BEGIN
  -- Generate unique ID format: FINOT-XXXX (e.g. FINOT-8392)
  generated_id := 'FINOT-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');

  INSERT INTO public.profiles (id, email, unique_student_id, role)
  VALUES (NEW.id, NEW.email, generated_id, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 9. AUTOMATIC TRIGGER FOR COURSE ENROLLMENT COUNTER
CREATE OR REPLACE FUNCTION increment_course_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' AND (OLD.status IS NULL OR OLD.status != 'verified') THEN
    UPDATE public.courses
    SET enrolled_count = enrolled_count + 1
    WHERE id = NEW.course_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_enrollment
AFTER UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION increment_course_enrollment();

-- 1. Clean up existing Triggers and Functions first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_increment_enrollment ON public.enrollments;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS increment_course_enrollment();

-- 2. Safe Enum Types Creation (Skips if already exists)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'owner_admin', 'assistant_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('null', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Updated for Signup Flow)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  unique_student_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  username VARCHAR(100) UNIQUE,
  gender gender_type,
  phone_number VARCHAR(20) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  profile_photo_url TEXT DEFAULT 'default-avatar.jpg',
  role user_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unique_student_id VARCHAR(50);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username VARCHAR(100);

-- 4. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  instructor_name VARCHAR(255) DEFAULT 'Finot Team',
  enrolled_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  unique_student_id VARCHAR(50) NOT NULL,
  payment_receipt_url TEXT NOT NULL,
  status enrollment_status DEFAULT 'pending',
  rejection_reason TEXT,
  progress_percentage INT DEFAULT 0,
  capstone_project_url TEXT,
  capstone_approved BOOLEAN DEFAULT false,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 7. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_code VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_pdf_url TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_audience VARCHAR(50) DEFAULT 'all', -- 'all', 'enrolled', 'rejected'
  is_pinned_banner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AUTOMATIC TRIGGER FOR SIGNUP PROFILE CREATION & UNIQUE ID GENERATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_id VARCHAR(50);
BEGIN
  -- Generate unique ID format: FINOT-XXXX (e.g. FINOT-8392)
  generated_id := 'FINOT-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');

  INSERT INTO public.profiles (id, email, unique_student_id, role)
  VALUES (NEW.id, NEW.email, generated_id, 'student')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 10. AUTOMATIC TRIGGER FOR COURSE ENROLLMENT COUNTER
CREATE OR REPLACE FUNCTION increment_course_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' AND (OLD.status IS NULL OR OLD.status != 'verified') THEN
    UPDATE public.courses
    SET enrolled_count = enrolled_count + 1
    WHERE id = NEW.course_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_enrollment
AFTER UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION increment_course_enrollment();

-- 1. የድሮውን Trigger Safely ማፅዳት
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Trigger Function-ን በጠነከረ መልኩ ማሻሻል (Conflict እንዳይፈጠር)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_id VARCHAR(50);
  default_name TEXT;
BEGIN
  -- Unique ID ማመንጨት (ምሳሌ፡ FINOT-8392)
  generated_id := 'FINOT-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
  default_name := split_part(NEW.email, '@', 1);

  INSERT INTO public.profiles (id, email, full_name, unique_student_id, role)
  VALUES (NEW.id, NEW.email, default_name, generated_id, 'student')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Triggerን አዲስ አድርጎ ማያያዝ
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
-- Column ስሙ phone የነበረ ከሆነ ወደ phone_number ይቀይረዋል
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE public.profiles RENAME COLUMN phone TO phone_number;
  END IF;
END $$;

-- 1. avatars bucket መኖሩን እና Public መሆኑን ማረጋገጥ
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. የቆዩ ፖሊሲዎች ካሉ ማፅዳት
DROP POLICY IF EXISTS "Public Access to Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;

-- 3. ማንኛውም ሰው አቫታር ፎቶ ማየት እንዲችል መፍቀድ (Public Read)
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 4. የተመዘገቡ ተማሪዎች አቫታር መጫን እንዲችሉ መፍቀድ (Insert)
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- 5. የተመዘገቡ ተማሪዎች አቫታራቸውን ማሻሻል እንዲችሉ መፍቀድ (Update)
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- 1. በ profiles ሰንጠረዥ ላይ RLS ማስቀጠል
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. ማንኛውም ሰው የተማሪዎችን ፕሮፋይል ማየት እንዲችል መፍቀድ (Read Access)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- 3. የተመዘገቡ ተማሪዎች የራሳቸውን ብቻ መረጃ ማዘመን እንዲችሉ መፍቀድ (Update Access)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 1. avatars bucket መኖሩን እና Public መሆኑን ማረጋገጥ
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. የቆዩ ፖሊሲዎችን ማፅዳት
DROP POLICY IF EXISTS "Public Access to Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

-- 3. ማንኛውም ሰው አቫታር ማየት እንዲችል መፍቀድ (Read)
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 4. የተመዘገቡ ተማሪዎች አቫታር መጫን እንዲችሉ መፍቀድ (Insert)
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- 5. የተመዘገቡ ተማሪዎች አቫታር ማሻሻል እንዲችሉ መፍቀድ (Update)
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- 6. የተመዘገቡ ተማሪዎች አቫታር መሰረዝ እንዲችሉ መፍቀድ (Delete)
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');
-- የተመዘገቡ ተማሪዎች የራሳቸውን ፕሮፋይል መፍጠር እንዲችሉ መፍቀድ (Insert Access)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses FOR SELECT USING (true);
UPDATE public.profiles 
SET role = 'owner_admin', username = 'FinotOwner'
WHERE email = 'barrokcreative@gmail.com';

-- የቆዩ ፖሊሲዎች ካሉ ማፅዳት
DROP POLICY IF EXISTS "Public Access to Certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update certificates" ON storage.objects;

-- ማንኛውም ሰው (ተማሪውም ጭምር) ሰርተፊኬቱን ማየትና ማውረድ እንዲችል (Read)
CREATE POLICY "Public Access to Certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- አድሚኑ ሰርተፊኬት መጫን እንዲችል መፍቀድ (Insert)
CREATE POLICY "Admin can upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

-- አድሚኑ ሰርተፊኬት ማደስ/መቀየር እንዲችል መፍቀድ (Update)
CREATE POLICY "Admin can update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates');

SELECT id, email, username, role, unique_student_id 
FROM public.profiles 
WHERE role = 'owner_admin' OR username = 'FinotOwner';

-- 1. ለአድሚኖች የተለየ admin_users ሰንጠረዥ መፍጠር
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'assistant_admin' CHECK (role IN ('owner_admin', 'assistant_admin')),
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS ማስከፈት እና Public Read/Write መፍቀድ (ለአድሚን ፖርታል)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full access to admin_users" ON public.admin_users;
CREATE POLICY "Allow full access to admin_users"
ON public.admin_users FOR ALL
USING (true)
WITH CHECK (true);

-- 3. የመጀመሪያውን Owner Admin ማስገባት
INSERT INTO public.admin_users (username, password, role, full_name)
VALUES ('FinotOwner', 'Finot@1712', 'owner_admin', 'Finot Owner Admin')
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password, role = EXCLUDED.role;

-- 1. enrollments ቴብል ላይ RLS ማደስ
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to insert own enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Allow users to view own enrollment" ON public.enrollments;

-- ተማሪዎች የራሳቸውን ምዝገባ ማስገባት እንዲችሉ መፍቀድ (Insert)
CREATE POLICY "Allow users to insert own enrollment"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ተማሪዎች የራሳቸውን ምዝገባ ማየት እንዲችሉ መፍቀድ (Select)
CREATE POLICY "Allow users to view own enrollment"
ON public.enrollments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. receipts storage bucket መኖሩን ማረጋገጥ እና ፖሊሲ መስጠት
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public access to receipts" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;

CREATE POLICY "Public access to receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'receipts');

CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- 1. enrollments ቴብል ላይ RLS ፖሊሲ ማስተካከል
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to insert own enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Allow users to view own enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Allow users to update own enrollment" ON public.enrollments;

CREATE POLICY "Allow users to insert own enrollment"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view own enrollment"
ON public.enrollments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own enrollment"
ON public.enrollments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 2. receipts storage bucket መኖሩን ማረጋገጥ እና ፖሊሲ መስጠት
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public access to receipts" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;

CREATE POLICY "Public access to receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'receipts');

CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');
INSERT INTO public.courses (title, slug, description, price, instructor_name, is_active)
VALUES 
('Graphics Design', 'graphics-design', 'Learn Graphic Design with Photoshop and Illustrator', 4200.00, 'Finot Team', true),
('Video Editing', 'video-editing', 'Learn Premiere Pro Video Editing', 7000.00, 'Finot Team', true),
('Social Media Marketing', 'smm-marketing', 'Social Media Marketing & Strategy', 3500.00, 'Finot Team', true),
('Prompt Engineering', 'prompt-engineering', 'Master AI Prompt Engineering', 2500.00, 'Finot Team', true)
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title, price = EXCLUDED.price, is_active = true;



-- 1. በ enrollments ቴብል ላይ የ user_id እና course_id UNIQUE Constraint መጨመር
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_id_course_id_key;

ALTER TABLE public.enrollments 
ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);
-- enrollments ቴብል ለአድሚን ገፅ Read/Update ፈቃድ መስጠት
DROP POLICY IF EXISTS "Allow full access for admin users on enrollments" ON public.enrollments;

CREATE POLICY "Allow full access for admin users on enrollments"
ON public.enrollments FOR ALL
USING (true)
WITH CHECK (true);
-- 1. profiles ቴብል ላይ ለአድሚን ገፅ ሙሉ ፈቃድ መስጠት
DROP POLICY IF EXISTS "Allow full access for admin on profiles" ON public.profiles;

CREATE POLICY "Allow full access for admin on profiles"
ON public.profiles FOR ALL
USING (true)
WITH CHECK (true);

-- 2. enrollments ቴብል ላይ ለአድሚን ገፅ ሙሉ ፈቃድ መስጠት
DROP POLICY IF EXISTS "Allow full access for admin on enrollments" ON public.enrollments;

CREATE POLICY "Allow full access for admin on enrollments"
ON public.enrollments FOR ALL
USING (true)
WITH CHECK (true);
-- 1. profiles ቴብል ለአድሚን ፍለጋ ክፍት ማድረግ
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read profiles" ON public.profiles;
CREATE POLICY "Allow full admin read profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. enrollments ቴብል ለአድሚን ፍለጋ ክፍት ማድረግ
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read enrollments" ON public.enrollments;
CREATE POLICY "Allow full admin read enrollments" ON public.enrollments FOR ALL USING (true) WITH CHECK (true);

-- 3. certificates ቴብል ለአድሚን ፍለጋ ክፍት ማድረግ
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read certificates" ON public.certificates;
CREATE POLICY "Allow full admin read certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
-- 1. profiles ቴብል ለአድሚን ፍለጋ ክፍት ማድረግ
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read profiles" ON public.profiles;
CREATE POLICY "Allow full admin read profiles" ON public.profiles FOR SELECT USING (true);

-- 2. enrollments ቴብል ለአድሚን ፍለጋ ክፍት ማድረግ
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read enrollments" ON public.enrollments;
CREATE POLICY "Allow full admin read enrollments" ON public.enrollments FOR SELECT USING (true);

-- 3. certificates ቴብል ለአድሚን ፍለጋ ክፍት ማድረግ
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read certificates" ON public.certificates;
CREATE POLICY "Allow full admin read certificates" ON public.certificates FOR SELECT USING (true);

-- 1. enrollments ቴብል ላይ ሙሉ ፈቃድ መክፈት
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow full access for admin users on enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow full access for admin on enrollments" ON public.enrollments;

CREATE POLICY "Allow admin full access on enrollments"
ON public.enrollments FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 2. profiles ቴብል ላይ ሙሉ ፈቃድ መክፈት
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full admin read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow full access for admin on profiles" ON public.profiles;

CREATE POLICY "Allow admin full access on profiles"
ON public.profiles FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. courses ቴብል ላይ ሙሉ ፈቃድ መክፈት
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;

CREATE POLICY "Allow public read courses"
ON public.courses FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admin manage courses"
ON public.courses FOR ALL
TO public
USING (true)
WITH CHECK (true);