import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadPhoto = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload photos');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('complaint-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('complaint-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      return null;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      const url = await uploadPhoto(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onPhotosChange([...photos, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} photo(s) uploaded successfully`);
    }

    setUploading(false);
    event.target.value = ''; // Reset input
  };

  const removePhoto = async (photoUrl: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = photoUrl.split('/complaint-photos/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        
        const { error } = await supabase.storage
          .from('complaint-photos')
          .remove([filePath]);

        if (error) throw error;
      }

      onPhotosChange(photos.filter(p => p !== photoUrl));
      toast.success('Photo removed');
    } catch (error: any) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors bg-background">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Choose Files</span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading || photos.length >= maxPhotos}
              className="hidden"
            />
          </Label>
        </div>
        
        <div className="flex-1">
          <Label htmlFor="camera-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors bg-background">
              <Camera className="h-4 w-4" />
              <span className="text-sm">Take Photo</span>
            </div>
            <input
              id="camera-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={uploading || photos.length >= maxPhotos}
              className="hidden"
            />
          </Label>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent mr-2"></div>
          Uploading...
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={photo}
                alt={`Complaint photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removePhoto(photo)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm">No photos uploaded yet</p>
          <p className="text-xs mt-1">You can upload up to {maxPhotos} photos</p>
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {photos.length} / {maxPhotos} photos uploaded
        </p>
      )}
    </div>
  );
};
