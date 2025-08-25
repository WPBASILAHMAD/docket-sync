import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Search, Package, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';

interface TrackingResult {
  awb: string;
  status: 'in_transit' | 'delivered' | 'pending' | 'exception';
  location: string;
  timestamp: string;
  description: string;
  carrier: string;
}

export default function TrackingManagement() {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);

  // Mock tracking data - in real app, this would come from AfterShip API
  const mockTrackingData: TrackingResult[] = [
    {
      awb: 'AWB123456789',
      status: 'in_transit',
      location: 'Dubai International Airport',
      timestamp: '2024-01-15T10:30:00Z',
      description: 'Package is in transit to destination',
      carrier: 'Emirates SkyCargo'
    },
    {
      awb: 'AWB987654321', 
      status: 'delivered',
      location: 'New York JFK Airport',
      timestamp: '2024-01-14T15:45:00Z',
      description: 'Package delivered successfully',
      carrier: 'DHL Express'
    },
    {
      awb: 'AWB555444333',
      status: 'pending',
      location: 'London Heathrow Airport',
      timestamp: '2024-01-16T08:15:00Z',
      description: 'Package awaiting customs clearance',
      carrier: 'British Airways Cargo'
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a tracking number',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = mockTrackingData.find(item => 
        item.awb.toLowerCase().includes(trackingNumber.toLowerCase())
      );
      
      if (result) {
        setTrackingResult(result);
        toast({
          title: 'Success',
          description: 'Tracking information found',
        });
      } else {
        setTrackingResult(null);
        toast({
          title: 'Not Found',
          description: 'No tracking information found for this number',
          variant: 'destructive',
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'exception':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'exception':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
          <MapPin className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tracking Management</h1>
          <p className="text-muted-foreground">Track shipments and manage delivery status</p>
        </div>
      </div>

      {/* Search Form */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">Track Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tracking_number">AWB Number / Tracking Number</Label>
              <Input
                id="tracking_number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter AWB number or tracking number"
                className="bg-background border-border"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Track Shipment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tracking Result */}
      {trackingResult && (
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground">Tracking Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{trackingResult.awb}</h3>
                <p className="text-sm text-muted-foreground">{trackingResult.carrier}</p>
              </div>
              <Badge className={getStatusColor(trackingResult.status)}>
                {getStatusIcon(trackingResult.status)}
                <span className="ml-1 capitalize">
                  {trackingResult.status.replace('_', ' ')}
                </span>
              </Badge>
            </div>

            <div className="bg-secondary/30 p-4 rounded-lg border border-border">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{trackingResult.location}</p>
                  <p className="text-sm text-muted-foreground">{trackingResult.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(trackingResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Tracking */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrackingData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.awb}</p>
                    <p className="text-sm text-muted-foreground">{item.carrier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}