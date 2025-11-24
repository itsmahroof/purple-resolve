import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Shield, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
const Index = () => {
  const navigate = useNavigate();
  const {
    user,
    userRole
  } = useAuth();
  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'admin') {
        navigate('/admin', {
          replace: true
        });
      } else {
        navigate('/student', {
          replace: true
        });
      }
    }
  }, [user, userRole, navigate]);
  return <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary mb-6 shadow-card">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            BroConnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Student complaint management system for Brototype
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Student Portal Card */}
          <Card 
            onClick={() => navigate('/login?role=student')}
            className="relative overflow-hidden shadow-card border-border/50 backdrop-blur-sm bg-card/95 hover:shadow-hover transition-all duration-300 group animate-scale-in cursor-pointer">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">For Students</CardTitle>
              <CardDescription className="text-base">
                Submit and track complaints with transparent status updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submit Complaints</p>
                    <p className="text-sm text-muted-foreground">Create and submit detailed complaints</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Track Progress</p>
                    <p className="text-sm text-muted-foreground">Monitor complaint status in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Get Updates</p>
                    <p className="text-sm text-muted-foreground">Receive admin notes and resolutions</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/login?role=student');
                  }} 
                  className="w-full" 
                  size="lg">
                  Student Login
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/signup?role=student');
                  }} 
                  variant="outline" 
                  className="w-full" 
                  size="sm">
                  Create Student Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Portal Card */}
          <Card 
            onClick={() => navigate('/login?role=admin')}
            className="relative overflow-hidden shadow-card border-border/50 backdrop-blur-sm bg-card/95 hover:shadow-hover transition-all duration-300 group animate-scale-in cursor-pointer" 
            style={{
              animationDelay: '0.1s'
            }}>
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">For Admins</CardTitle>
              <CardDescription className="text-base">
                Manage complaints efficiently with powerful filters and tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">View All Complaints</p>
                    <p className="text-sm text-muted-foreground">Access complete complaint database</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Resolve Issues</p>
                    <p className="text-sm text-muted-foreground">Update status and add admin notes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Filter & Track</p>
                    <p className="text-sm text-muted-foreground">Advanced filtering and analytics</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/login?role=admin');
                  }} 
                  variant="secondary" 
                  className="w-full" 
                  size="lg">
                  Admin Login
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/signup?role=admin');
                  }} 
                  variant="outline" 
                  className="w-full" 
                  size="sm">
                  Create Admin Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>;
};
export default Index;