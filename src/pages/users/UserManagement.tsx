import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Users, UserPlus, Edit, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'main_admin' | 'second_admin' | 'manager' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const { profile: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data as Profile[]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const getRoleColor = (role: string) => {
    switch (role) {
      case 'main_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'second_admin':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'main_admin':
      case 'second_admin':
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">
              Manage system users and roles
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>

        <CreateUserDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={fetchProfiles}
        />

        <EditUserDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          profile={selectedProfile}
          onSuccess={fetchProfiles}
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="border-border shadow-soft hover:shadow-elegant transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-sm font-medium text-primary">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">
                      {profile.full_name}
                    </CardTitle>
                    <Badge className={getRoleColor(profile.role)}>
                      {getRoleIcon(profile.role)}
                      <span className="ml-1 capitalize">
                        {profile.role.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground truncate">{profile.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Joined {format(new Date(profile.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={profile.is_active ? "default" : "secondary"}
                    className={profile.is_active ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {profile.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {currentUser?.id !== profile.id && (
                <div className="pt-4 border-t border-border">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full border-border hover:bg-secondary"
                    onClick={() => {
                      setSelectedProfile(profile);
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit className="mr-2 h-3 w-3" />
                    Edit User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}