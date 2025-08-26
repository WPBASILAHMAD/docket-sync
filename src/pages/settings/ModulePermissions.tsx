import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  FileText, 
  Package, 
  MapPin, 
  DollarSign, 
  Users, 
  Settings,
  LayoutDashboard,
  Truck
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface RolePermission {
  role: string;
  moduleId: string;
  enabled: boolean;
}

const AVAILABLE_MODULES: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main overview and analytics',
    icon: <LayoutDashboard className="h-4 w-4" />,
    category: 'Core'
  },
  {
    id: 'manifest',
    name: 'Manifest Management',
    description: 'Create and manage dockets',
    icon: <Truck className="h-4 w-4" />,
    category: 'Operations'
  },
  {
    id: 'connotes',
    name: 'Connotes',
    description: 'Shipment documentation',
    icon: <FileText className="h-4 w-4" />,
    category: 'Operations'
  },
  {
    id: 'tracking',
    name: 'Tracking Management',
    description: 'Track shipments and updates',
    icon: <MapPin className="h-4 w-4" />,
    category: 'Operations'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial management and billing',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'Business'
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage user accounts and roles',
    icon: <Users className="h-4 w-4" />,
    category: 'Administration'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration',
    icon: <Settings className="h-4 w-4" />,
    category: 'Administration'
  }
];

const USER_ROLES = [
  { id: 'main_admin', name: 'Main Admin', color: 'bg-red-500' },
  { id: 'second_admin', name: 'Second Admin', color: 'bg-orange-500' },
  { id: 'manager', name: 'Manager', color: 'bg-blue-500' },
  { id: 'staff', name: 'Staff', color: 'bg-green-500' }
];

export function ModulePermissions() {
  const { profile } = useAuth();
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');

      if (error) throw error;

      // If no permissions exist, create defaults
      if (!data || data.length === 0) {
        await createDefaultPermissions();
        return;
      }

      setPermissions(data);
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPermissions = async () => {
    const defaultPermissions: RolePermission[] = [];
    
    // Main admin gets all modules
    AVAILABLE_MODULES.forEach(module => {
      defaultPermissions.push({
        role: 'main_admin',
        moduleId: module.id,
        enabled: true
      });
    });

    // Second admin gets most modules except user management
    AVAILABLE_MODULES.forEach(module => {
      defaultPermissions.push({
        role: 'second_admin',
        moduleId: module.id,
        enabled: module.id !== 'users'
      });
    });

    // Manager gets operational modules
    ['dashboard', 'manifest', 'connotes', 'tracking', 'settings'].forEach(moduleId => {
      defaultPermissions.push({
        role: 'manager',
        moduleId,
        enabled: true
      });
    });

    // Staff gets basic modules
    ['dashboard', 'connotes', 'tracking'].forEach(moduleId => {
      defaultPermissions.push({
        role: 'staff',
        moduleId,
        enabled: true
      });
    });

    try {
      const { error } = await supabase
        .from('role_permissions')
        .insert(defaultPermissions);

      if (error) throw error;

      setPermissions(defaultPermissions);
      toast.success('Default permissions created');
    } catch (error) {
      console.error('Error creating default permissions:', error);
      toast.error('Failed to create default permissions');
    }
  };

  const togglePermission = async (role: string, moduleId: string) => {
    const existing = permissions.find(p => p.role === role && p.moduleId === moduleId);
    const newEnabled = existing ? !existing.enabled : true;

    try {
      if (existing) {
        const { error } = await supabase
          .from('role_permissions')
          .update({ enabled: newEnabled })
          .eq('role', role)
          .eq('module_id', moduleId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role, module_id: moduleId, enabled: newEnabled });

        if (error) throw error;
      }

      setPermissions(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.role === role && p.moduleId === moduleId);
        
        if (index >= 0) {
          updated[index] = { ...updated[index], enabled: newEnabled };
        } else {
          updated.push({ role, moduleId, enabled: newEnabled });
        }
        
        return updated;
      });

      toast.success('Permission updated');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  const isModuleEnabled = (role: string, moduleId: string) => {
    const permission = permissions.find(p => p.role === role && p.moduleId === moduleId);
    return permission?.enabled ?? false;
  };

  // Only main admin can access this page
  if (profile?.role !== 'main_admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Only main administrators can manage module permissions.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const modulesByCategory = AVAILABLE_MODULES.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Module Permissions</h1>
        <p className="text-muted-foreground">
          Configure which modules each user role can access
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(modulesByCategory).map(([category, modules]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category} Modules</CardTitle>
              <CardDescription>
                Control access to {category.toLowerCase()} features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    {module.icon}
                    <div>
                      <h3 className="font-semibold">{module.name}</h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {USER_ROLES.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${role.color}`} />
                          <span className="text-sm font-medium">{role.name}</span>
                        </div>
                        <Switch
                          checked={isModuleEnabled(role.id, module.id)}
                          onCheckedChange={() => togglePermission(role.id, module.id)}
                          disabled={role.id === 'main_admin'} // Main admin always has access
                        />
                      </div>
                    ))}
                  </div>
                  
                  {module !== modules[modules.length - 1] && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
          <CardDescription>
            Overview of all role permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {USER_ROLES.map((role) => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  <span className="font-medium">{role.name}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {AVAILABLE_MODULES.map((module) => (
                    <Badge
                      key={module.id}
                      variant={isModuleEnabled(role.id, module.id) ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {module.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}