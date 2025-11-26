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
  return <div className="min-h-screen bg-background relative">
      <div className="absolute top-6 right-6 z-10">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto px-6 py-20 relative">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-24 animate-fade-in text-center">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-primary bg-primary/10 px-4 py-2 rounded-full">
              <GraduationCap className="h-4 w-4" />
              Brototype Portal
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            BroConnect
          </h1>
          <p className="text-2xl max-w-3xl mx-auto leading-relaxed text-center font-normal md:text-2xl text-slate-600">
            complaint management for students and administrators
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Student Portal Card */}
          <Card onClick={() => navigate('/login?role=student')} className="group relative border-2 border-border hover:border-primary bg-card transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="space-y-6 relative pb-8">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                  Students
                </div>
              </div>
              
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Submit & Track</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Voice your concerns with real-time status updates
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="space-y-4 py-6 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm font-medium">Submit detailed complaints</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm font-medium">Real-time progress tracking</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm font-medium">Direct admin communication</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/login?role=student');
              }} size="lg" className="w-full font-semibold transition-all duration-200 active:scale-95 hover:shadow-lg bg-[#554cf8]">
                  Login
                </Button>
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/signup?role=student');
              }} variant="ghost" className="w-full font-medium transition-all duration-200 active:scale-95">
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Portal Card */}
          <Card onClick={() => navigate('/login?role=admin')} className="group relative border-2 border-border hover:border-accent bg-card transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="space-y-6 relative pb-8">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Shield className="h-7 w-7 text-accent" />
                </div>
                <div className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wide">
                  Admins
                </div>
              </div>
              
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Manage & Resolve</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Efficient complaint management with powerful tools
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="space-y-4 py-6 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent flex-shrink-0" />
                  <p className="text-sm font-medium">Complete complaint database</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <p className="text-sm font-medium">Status updates & admin notes</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-accent flex-shrink-0" />
                  <p className="text-sm font-medium">Advanced filtering & analytics</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/login?role=admin');
              }} variant="secondary" size="lg" className="w-full font-semibold transition-all duration-200 active:scale-95 hover:shadow-lg bg-[inherit] text-inherit border">
                  Login
                </Button>
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/signup?role=admin');
              }} variant="ghost" className="w-full font-medium transition-all duration-200 active:scale-95">
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>;
};
export default Index;