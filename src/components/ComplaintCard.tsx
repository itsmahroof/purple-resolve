import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: 'Pending' | 'In Review' | 'Resolved';
    priority: 'Low' | 'Medium' | 'High';
    created_at: string;
    updated_at: string;
  };
  onClick: () => void;
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

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 shadow-card border-border/50 backdrop-blur-sm bg-card/95 animate-fade-in"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{complaint.title}</CardTitle>
            <CardDescription className="mt-1">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(complaint.created_at), 'MMM d, yyyy')}
              </span>
            </CardDescription>
          </div>
          {complaint.priority === 'High' && (
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {complaint.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={statusColors[complaint.status]}>
            {complaint.status}
          </Badge>
          <Badge variant="outline" className={priorityColors[complaint.priority]}>
            {complaint.priority}
          </Badge>
          <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground border-border/30">
            {complaint.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
