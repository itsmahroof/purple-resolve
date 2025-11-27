import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Shield, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
const Index = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { theme } = useTheme();
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
  return (
    <div
      className={cn(
        'min-h-screen bg-background dark:bg-background relative overflow-hidden transition-colors duration-300',
        theme === 'dark' && 'dark'
      )}
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-60 dark:opacity-30"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 dark:bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary-glow/10 dark:bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="absolute top-6 right-6 z-10">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 animate-fade-in text-center">
          <div className="mb-8 flex justify-center animate-slide-up">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-primary-foreground bg-gradient-primary px-5 py-2.5 rounded-full shadow-hover border border-primary-glow/30">
              <GraduationCap className="h-4 w-4" />
              Brototype Portal
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-gradient animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            BroConnect
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-center font-medium text-muted-foreground dark:text-muted-foreground">
            Modern complaint management for students and administrators
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Student Portal Card */}
          <Card onClick={() => navigate('/login?role=student')} className="group relative bg-card dark:bg-card backdrop-blur-xl border-2 border-border dark:border-border transition-all duration-500 cursor-pointer overflow-hidden shadow-glass dark:shadow-xl hover:shadow-hover dark:hover:shadow-2xl animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-transparent dark:from-primary/20 dark:via-primary-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            <CardHeader className="space-y-6 relative pb-8">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-2xl bg-gradient-primary shadow-card group-hover:shadow-hover transition-shadow duration-300">
                  <FileText className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/15 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  Students
                </div>
              </div>
              
              <div>
                <CardTitle className="text-3xl sm:text-4xl font-black mb-3 text-foreground dark:text-foreground group-hover:text-primary transition-colors duration-300">Submit & Track</CardTitle>
                <CardDescription className="text-base sm:text-lg text-muted-foreground dark:text-muted-foreground font-medium">
                  Voice your concerns with real-time status updates
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="space-y-5 py-6 border-t border-border/30">
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">Submit detailed complaints</p>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">Real-time progress tracking</p>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">Direct admin communication</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/login?role=student');
              }} size="lg" className="w-full font-bold text-base transition-all duration-300 active:scale-95 hover:shadow-hover bg-gradient-primary hover:bg-gradient-hero animate-gradient relative overflow-hidden group/btn" style={{ backgroundSize: '200% 200%' }}>
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-primary-foreground/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/signup?role=student');
              }} variant="outline" className="w-full font-semibold text-base transition-all duration-300 active:scale-95 hover:bg-primary/5 hover:border-primary/30 backdrop-blur-sm">
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Portal Card */}
          <Card onClick={() => navigate('/login?role=admin')} className="group relative bg-card dark:bg-card backdrop-blur-xl border-2 border-border dark:border-border transition-all duration-500 cursor-pointer overflow-hidden shadow-glass dark:shadow-xl hover:shadow-hover dark:hover:shadow-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent dark:from-accent/20 dark:via-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 dark:via-accent/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            <CardHeader className="space-y-6 relative pb-8">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-card group-hover:shadow-hover transition-shadow duration-300">
                  <Shield className="h-7 w-7 text-accent-foreground" />
                </div>
                <div className="px-4 py-2 rounded-full bg-accent/15 backdrop-blur-sm text-accent text-xs font-bold uppercase tracking-wider border border-accent/20">
                  Admins
                </div>
              </div>
              
              <div>
                <CardTitle className="text-3xl sm:text-4xl font-black mb-3 text-foreground dark:text-foreground group-hover:text-accent transition-colors duration-300">Manage & Resolve</CardTitle>
                <CardDescription className="text-base sm:text-lg text-muted-foreground dark:text-muted-foreground font-medium">
                  Efficient complaint management with powerful tools
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="space-y-5 py-6 border-t border-border/30">
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors duration-300">
                    <FileText className="h-5 w-5 text-accent flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">Complete complaint database</p>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors duration-300">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">Status updates & admin notes</p>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors duration-300">
                    <TrendingUp className="h-5 w-5 text-accent flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground dark:text-foreground">Advanced filtering & analytics</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/login?role=admin');
              }} size="lg" className="w-full font-bold text-base transition-all duration-300 active:scale-95 hover:shadow-hover bg-gradient-to-r from-accent to-accent/80 hover:from-accent hover:to-accent text-accent-foreground relative overflow-hidden group/btn">
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-accent-foreground/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <Button onClick={e => {
                e.stopPropagation();
                navigate('/signup?role=admin');
              }} variant="outline" className="w-full font-semibold text-base transition-all duration-300 active:scale-95 hover:bg-accent/5 hover:border-accent/30 backdrop-blur-sm">
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default Index;