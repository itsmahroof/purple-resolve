import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, Clock, User, Tag, AlertCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ComplaintUpdateSchema } from '@/validation/ComplaintSchema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  student_id: string;
  photo_urls: string[];
}

interface Profile {
  name: string;
  email: string;
}

const ComplaintDetail = () => {
  const { id } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [status, setStatus] = useState<'Pending' | 'In Review' | 'Resolved'>('Pending');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data: complaintData, error: complaintError } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (complaintError) throw complaintError;
      setComplaint(complaintData);
      setStatus(complaintData.status);
      setAdminNote(complaintData.admin_note || '');

      // Fetch student profile if admin
      if (userRole === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', complaintData.student_id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      }
    } catch (error: any) {
      toast.error('Failed to load complaint');
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!complaint) return;

    setValidationError(null);

    // Validate using centralized schema
    const noteValue = adminNote.trim() || null;
    const validation = ComplaintUpdateSchema.safeParse({
      status,
      admin_note: noteValue
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setValidationError(firstError.message);
      toast.error(firstError.message);
      return;
    }

    setUpdating(true);
    try {
      // Sanitize admin note to prevent XSS attacks
      const sanitizedNote = validation.data.admin_note 
        ? DOMPurify.sanitize(validation.data.admin_note)
        : null;

      const { error } = await supabase
        .from('complaints')
        .update({
          status: validation.data.status,
          admin_note: sanitizedNote,
        })
        .eq('id', complaint.id);

      if (error) {
        // Check for database constraint violations
        if (error.message.includes('too long') || error.message.includes('length')) {
          throw new Error('Admin note exceeds maximum length of 300 characters.');
        }
        throw error;
      }

      toast.success('Complaint updated successfully');
      setValidationError(null);
      fetchComplaint();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update complaint';
      setValidationError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating complaint:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!complaint) return;

    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaint.id);

      if (error) throw error;

      toast.success('Complaint deleted successfully');
      navigate('/admin');
    } catch (error: any) {
      toast.error('Failed to delete complaint');
      console.error('Error deleting complaint:', error);
    }
  };

  const goBack = () => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Complaint not found</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    Pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    'In Review': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Resolved: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  };

  const priorityColors = {
    Low: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    Medium: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    High: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={goBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6 animate-fade-in">
          <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{complaint.title}</CardTitle>
                  <CardDescription>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Created {format(new Date(complaint.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </CardDescription>
                </div>
                {userRole === 'admin' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this complaint? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={statusColors[complaint.status]}>
                  {complaint.status}
                </Badge>
                <Badge variant="outline" className={priorityColors[complaint.priority]}>
                  {complaint.priority} Priority
                </Badge>
                <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground border-border/30">
                  <Tag className="mr-1 h-3 w-3" />
                  {complaint.category}
                </Badge>
              </div>

              {userRole === 'admin' && profile && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border/30">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {complaint.photo_urls && complaint.photo_urls.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Photos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {complaint.photo_urls.map((photoUrl, index) => (
                      <a
                        key={index}
                        href={photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors group"
                      >
                        <img
                          src={photoUrl}
                          alt={`Complaint photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {complaint.admin_note && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Admin Note
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {complaint.admin_note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {userRole === 'admin' && (
            <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Update complaint status and add notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Error</AlertTitle>
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-note">Admin Note (Max 300 characters)</Label>
                  <Textarea
                    id="admin-note"
                    placeholder="Add notes about this complaint..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    maxLength={300}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {adminNote.length}/300 characters
                  </p>
                </div>

                <Button onClick={handleUpdate} disabled={updating} className="w-full">
                  {updating ? 'Updating...' : 'Update Complaint'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
