import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { 
  Package, 
  LayoutDashboard, 
  FileText, 
  Truck, 
  MapPin, 
  DollarSign, 
  Users, 
  Settings,
  ChevronDown,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: NavItem[];
  roles?: ('main_admin' | 'second_admin' | 'manager' | 'staff')[];
  locked?: boolean;
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Manifest',
    icon: FileText,
    children: [
      {
        title: 'New Docket',
        href: '/manifest/new-docket',
        icon: FileText,
        roles: ['main_admin', 'second_admin', 'manager'],
      },
      {
        title: 'Open Dockets',
        href: '/manifest/open',
        icon: FileText,
      },
      {
        title: 'Closed Dockets',
        href: '/manifest/closed',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Connotes',
    icon: Package,
    children: [
      {
        title: 'Add Connote',
        href: '/connotes/add',
        icon: Package,
      },
      {
        title: 'Connotes List',
        href: '/connotes/list',
        icon: Package,
      },
    ],
  },
  {
    title: 'Tracking',
    href: '/tracking',
    icon: MapPin,
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
    locked: true,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: ['main_admin', 'second_admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const { profile, hasRole } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Manifest', 'Connotes']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const canAccessItem = (item: NavItem): boolean => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    if (!canAccessItem(item)) return null;

    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href === location.pathname;

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full justify-start font-normal text-left",
              level > 0 && "ml-4"
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
            {isExpanded ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </Button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.title} className={cn(level > 0 && "ml-4")}>
        {item.href ? (
          <Link to={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start font-normal",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
              disabled={item.locked}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
              {item.locked && (
                <>
                  <Lock className="ml-auto h-3 w-3 text-muted-foreground" />
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Early Access
                  </Badge>
                </>
              )}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start font-normal",
              item.locked && "opacity-50"
            )}
            disabled={item.locked}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
            {item.locked && (
              <>
                <Lock className="ml-auto h-3 w-3 text-muted-foreground" />
                <Badge variant="secondary" className="ml-2 text-xs">
                  Early Access
                </Badge>
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-border">
        <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
          <Truck className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-bold text-foreground">DocketSync</h1>
          <p className="text-xs text-muted-foreground">Cargo Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigation.map(item => renderNavItem(item))}
      </nav>

      {/* User Info */}
      {profile && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <span className="text-sm font-medium text-primary">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile.full_name}
              </p>
              <Badge variant="outline" className="text-xs capitalize">
                {profile.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}