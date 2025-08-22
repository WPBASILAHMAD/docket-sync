import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from './LoginForm';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
}