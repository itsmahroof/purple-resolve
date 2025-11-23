import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhotoUpload } from '@/components/PhotoUpload';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const complaintSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.enum(['Technical Issue', 'Faculty', 'Infrastructure', 'Course Content', 'Administrative', 'Other']),
  priority: z.enum(['Low', 'Medium', 'High'])
});

const categories = [
  'Technical Issue',
  'Faculty',
  'Infrastructure',
  'Course Content',
  'Administrative',
  'Other',
];

const NewComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input using zod schema
    const validation = complaintSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      category,
      priority
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('complaints').insert({
        student_id: user?.id,
        title: validation.data.title,
        description: validation.data.description,
        category: validation.data.category,
        priority: validation.data.priority,
        photo_urls: photos,
      });

      if (error) throw error;

      toast.success('Complaint submitted successfully');
      navigate('/student');
    } catch (error: any) {
      toast.error('Failed to submit complaint');
      console.error('Error creating complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/student')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Submit New Complaint</CardTitle>
            <CardDescription>
              Fill out the form below to submit your complaint. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your complaint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)} required>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your complaint"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Photos (Optional)</Label>
                <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/student')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewComplaint;
