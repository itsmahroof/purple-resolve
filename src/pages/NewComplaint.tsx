import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhotoUpload } from '@/components/PhotoUpload';
import { toast } from 'sonner';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ComplaintSchema } from '@/validation/ComplaintSchema';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Validate input using centralized schema
    const validation = ComplaintSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      category,
      priority
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setValidationError(firstError.message);
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    try {
      // Sanitize description to prevent XSS attacks
      const sanitizedDescription = DOMPurify.sanitize(validation.data.description);
      
      const { error } = await supabase.from('complaints').insert({
        student_id: user?.id,
        title: validation.data.title,
        description: sanitizedDescription,
        category: validation.data.category,
        priority: validation.data.priority,
        photo_urls: photos,
      });

      if (error) {
        // Check for database constraint violations
        if (error.message.includes('too long') || error.message.includes('length')) {
          throw new Error('Input exceeds maximum length. Please shorten your text.');
        }
        throw error;
      }

      toast.success('Complaint submitted successfully');
      navigate('/student');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit complaint';
      setValidationError(errorMessage);
      toast.error(errorMessage);
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
            {validationError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title * (3-100 characters)</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your complaint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters
                </p>
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
                <Label htmlFor="description">Description * (10-500 characters)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your complaint"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  required
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/500 characters
                </p>
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
