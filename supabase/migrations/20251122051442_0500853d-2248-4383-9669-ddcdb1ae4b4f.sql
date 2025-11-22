-- Fix search_path for create_demo_users function
CREATE OR REPLACE FUNCTION public.create_demo_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  demo_student_id uuid;
  demo_admin_id uuid;
BEGIN
  -- Note: In production, you should create users via auth.admin API
  -- This is a helper to document demo credentials
  
  -- Demo credentials:
  -- Student: student@demo.com / Student123!
  -- Admin: admin@demo.com / Admin123!
  
  RAISE NOTICE 'Demo user credentials:';
  RAISE NOTICE 'Student - Email: student@demo.com, Password: Student123!';
  RAISE NOTICE 'Admin - Email: admin@demo.com, Password: Admin123!';
END;
$$;