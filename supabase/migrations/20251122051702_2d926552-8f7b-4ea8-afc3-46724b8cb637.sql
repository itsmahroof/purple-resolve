-- Create storage bucket for complaint photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-photos', 'complaint-photos', true);

-- Add photo_urls column to complaints table
ALTER TABLE public.complaints
ADD COLUMN photo_urls text[] DEFAULT '{}';

-- RLS policies for complaint-photos bucket
CREATE POLICY "Students can upload their own complaint photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'complaint-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own complaint photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all complaint photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can delete their own complaint photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);