import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Package, Calendar, MapPin, Plane } from 'lucide-react';
import { format } from 'date-fns';

interface Docket {
  id: string;
  summary_no: string;
  date: string;
  docket_no: string;
  station: string;
  carrier: string;
  flight_no: string;
  bags: number;
  weight: number;
  country: string;
  load_no: string;
  status: 'open' | 'closed';
  created_at: string;
}

export default function OpenDockets() {
  const { toast } = useToast();
  const [dockets, setDockets] = useState<Docket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOpenDockets();
  }, []);

  const fetchOpenDockets = async () => {
    try {
      const { data, error } = await supabase
        .from('dockets')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDockets(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch open dockets',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeDocket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dockets')
        .update({ status: 'closed' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Docket closed successfully',
      });

      fetchOpenDockets();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close docket',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Open Dockets</h1>
            <p className="text-muted-foreground">Loading active dockets...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-border shadow-soft animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Open Dockets</h1>
            <p className="text-muted-foreground">
              {dockets.length} active dockets
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Package className="mr-1 h-3 w-3" />
          {dockets.length} Open
        </Badge>
      </div>

      {/* Dockets Grid */}
      {dockets.length === 0 ? (
        <Card className="border-border shadow-soft">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Open Dockets</h3>
            <p className="text-muted-foreground">
              All dockets have been closed or no dockets have been created yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dockets.map((docket) => (
            <Card key={docket.id} className="border-border shadow-soft hover:shadow-elegant transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">
                    {docket.docket_no}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Open
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Summary: {docket.summary_no}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {format(new Date(docket.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {docket.station} → {docket.country}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Plane className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {docket.carrier} {docket.flight_no && `- ${docket.flight_no}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {docket.bags} bags, {docket.weight} kg
                    </span>
                  </div>

                  {docket.load_no && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Load: </span>
                      <span className="text-foreground">{docket.load_no}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <Button 
                    onClick={() => closeDocket(docket.id)}
                    variant="outline"
                    size="sm"
                    className="w-full border-border hover:bg-secondary"
                  >
                    Close Docket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}