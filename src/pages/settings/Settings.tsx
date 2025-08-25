import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Settings as SettingsIcon, User, Bell, Shield, Key, Save } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  });

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    desktop_notifications: true,
    marketing_emails: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
        })
        .eq('user_id', profile?.user_id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
          <SettingsIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16 bg-primary/10">
                    <AvatarFallback className="text-primary text-xl font-semibold">
                      {profile?.full_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{profile?.full_name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {profile?.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted border-border"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-border shadow-soft">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Notification Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your shipments</p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email_notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notifications" className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get SMS alerts for important updates</p>
                </div>
                <Switch
                  id="sms_notifications"
                  checked={preferences.sms_notifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, sms_notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktop_notifications" className="text-base">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show browser notifications</p>
                </div>
                <Switch
                  id="desktop_notifications"
                  checked={preferences.desktop_notifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, desktop_notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing_emails" className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                </div>
                <Switch
                  id="marketing_emails"
                  checked={preferences.marketing_emails}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing_emails: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Actions */}
        <div className="space-y-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start border-border hover:bg-secondary">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>

              <div className="pt-4 border-t border-border">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-foreground">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">User ID</Label>
                <p className="text-sm font-mono text-foreground break-all">{profile?.user_id}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Account Created</Label>
                <p className="text-sm text-foreground">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Role</Label>
                <p className="text-sm text-foreground capitalize">
                  {profile?.role?.replace('_', ' ')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}