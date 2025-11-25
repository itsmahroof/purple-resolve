import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Signed in successfully');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4 py-8 sm:p-4 relative overflow-x-hidden">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="animate-fade-in">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle />
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6 sm:mb-8 px-2">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-primary mb-4 shadow-card animate-scale-in">
            <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent break-words">
            {roleParam === 'admin' ? 'Admin' : roleParam === 'student' ? 'Student' : ''} Login
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base px-4">
            {roleParam === 'admin' 
              ? 'Manage and resolve complaints' 
              : roleParam === 'student' 
              ? 'Submit and track your complaints'
              : 'Sign in to your account'}
          </p>
        </div>

        <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95 animate-scale-in mx-2 sm:mx-0">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-sm">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-200 active:scale-95 hover:shadow-lg" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto transition-all duration-200 hover:scale-105" 
                onClick={() => navigate(`/signup${roleParam ? `?role=${roleParam}` : ''}`)}
              >
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 px-4">
          Demo credentials will be provided by your administrator
        </p>
      </div>
    </div>
  );
};

export default Login;
