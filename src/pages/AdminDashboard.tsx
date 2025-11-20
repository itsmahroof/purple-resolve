import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { ComplaintCard } from '@/components/ComplaintCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'In Review' | 'Resolved'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error: any) {
      toast.error('Failed to load complaints');
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inReview: complaints.filter(c => c.status === 'In Review').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
    };
  };

  const getFilteredComplaints = () => {
    if (filter === 'all') return complaints;
    return complaints.filter(c => c.status === filter);
  };

  const stats = getStats();
  const filteredComplaints = getFilteredComplaints();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and resolve student complaints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inReview}</p>
                <p className="text-sm text-muted-foreground">In Review</p>
              </div>
            </div>
          </div>

          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="In Review">In Review</TabsTrigger>
            <TabsTrigger value="Resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'No complaints have been submitted yet'
                : `No ${filter.toLowerCase()} complaints`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint, index) => (
              <div
                key={complaint.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ComplaintCard
                  complaint={complaint}
                  onClick={() => navigate(`/admin/complaint/${complaint.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
