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