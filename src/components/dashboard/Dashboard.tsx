import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  FileText, 
  TrendingUp, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Truck,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  {
    title: 'Total Shipments',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Open Dockets',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: FileText,
    color: 'text-cargo-orange',
    bgColor: 'bg-cargo-orange-light',
  },
  {
    title: 'In Transit',
    value: '156',
    change: '-8%',
    trend: 'down',
    icon: Truck,
    color: 'text-success',
    bgColor: 'bg-success-light',
  },
  {
    title: 'Delivered Today',
    value: '42',
    change: '+18%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success-light',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'connote_created',
    description: 'New connote AWB-2024-001234 created',
    time: '2 minutes ago',
    icon: Package,
    status: 'created',
  },
  {
    id: 2,
    type: 'shipment_delivered',
    description: 'Shipment AWB-2024-001230 delivered to John Doe',
    time: '15 minutes ago',
    icon: CheckCircle,
    status: 'delivered',
  },
  {
    id: 3,
    type: 'docket_closed',
    description: 'Docket DOC-2024-045 has been closed',
    time: '1 hour ago',
    icon: FileText,
    status: 'closed',
  },
  {
    id: 4,
    type: 'alert',
    description: 'Delayed shipment AWB-2024-001225 needs attention',
    time: '2 hours ago',
    icon: AlertTriangle,
    status: 'warning',
  },
];

export function Dashboard() {
  const { profile } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-primary/10 text-primary';
      case 'delivered':
        return 'bg-success-light text-success';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      case 'warning':
        return 'bg-warning-light text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.full_name}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your cargo operations today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild>
            <Link to="/connotes/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Connote
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className={`mr-1 h-3 w-3 ${
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
                }`} />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your cargo operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className={`p-1.5 rounded-full ${getStatusColor(activity.status)}`}>
                    <activity.icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/connotes/add">
                <Package className="mr-2 h-4 w-4" />
                Create New Connote
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/manifest/new-docket">
                <FileText className="mr-2 h-4 w-4" />
                Create New Docket
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/tracking">
                <MapPin className="mr-2 h-4 w-4" />
                Track Shipment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/connotes/list">
                <Package className="mr-2 h-4 w-4" />
                View All Connotes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Key metrics for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">98.5%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
              <Badge variant="secondary" className="mt-1">+2.3%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Days Transit</div>
              <Badge variant="secondary" className="mt-1">-0.5 days</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cargo-orange mb-2">99.2%</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              <Badge variant="secondary" className="mt-1">+1.1%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}