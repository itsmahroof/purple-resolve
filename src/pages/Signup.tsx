import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as 'student' | 'admin' | null;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>(roleParam || 'student');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    
    if (error) {
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered. Please sign in.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } else {
      toast.success('Account created successfully! You can now sign in.');
      navigate(`/login?role=${role}`);
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
            Create {role === 'admin' ? 'Admin' : 'Student'} Account
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base px-4">Join Brototype Complaint Platform</p>
        </div>

        <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95 animate-scale-in mx-2 sm:mx-0">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl">Sign Up</CardTitle>
            <CardDescription className="text-sm">Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
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
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-sm sm:text-base"
                  required
                  minLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-200 active:scale-95 hover:shadow-lg" 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto transition-all duration-200 hover:scale-105" 
                onClick={() => navigate(`/login${roleParam ? `?role=${roleParam}` : ''}`)}
              >
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 px-4">
          By signing up, you'll be able to access the {role === 'admin' ? 'admin' : 'student'} dashboard immediately
        </p>
      </div>
    </div>
  );
};

export default Signup;
