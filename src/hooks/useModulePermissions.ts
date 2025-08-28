import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ModulePermission {
  moduleId: string;
  enabled: boolean;
}

export function useModulePermissions() {
  const { profile } = useAuth();
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.role) return;

    const loadPermissions = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('role_permissions')
          .select('module_id, enabled')
          .eq('role', profile.role)
          .eq('enabled', true);

        if (error) throw error;

        const mappedPermissions = data?.map((item: any) => ({
          moduleId: item.module_id,
          enabled: item.enabled
        })) || [];

        setPermissions(mappedPermissions);
      } catch (error) {
        console.error('Error loading module permissions:', error);
        // Fallback to default permissions based on role
        setPermissions(getDefaultPermissions(profile.role));
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [profile?.role]);

  const hasModuleAccess = (moduleId: string): boolean => {
    // Main admin always has access
    if (profile?.role === 'main_admin') return true;
    
    return permissions.some(p => p.moduleId === moduleId && p.enabled);
  };

  return { hasModuleAccess, loading };
}

// Fallback permissions if database query fails
function getDefaultPermissions(role: string): ModulePermission[] {
  const allModules = ['dashboard', 'manifest', 'connotes', 'tracking', 'finance', 'users', 'settings'];
  
  switch (role) {
    case 'main_admin':
      return allModules.map(id => ({ moduleId: id, enabled: true }));
    case 'second_admin':
      return allModules.filter(id => id !== 'users').map(id => ({ moduleId: id, enabled: true }));
    case 'manager':
      return ['dashboard', 'manifest', 'connotes', 'tracking', 'settings'].map(id => ({ moduleId: id, enabled: true }));
    case 'staff':
      return ['dashboard', 'connotes', 'tracking'].map(id => ({ moduleId: id, enabled: true }));
    default:
      return [];
  }
}