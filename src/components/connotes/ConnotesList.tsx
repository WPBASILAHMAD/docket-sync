import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Printer, 
  Package,
  Plus,
  Loader2
} from 'lucide-react';

interface Connote {
  id: string;
  awb_number: string;
  shipper_name: string;
  consignee_name: string;
  consignee_city: string;
  consignee_country: string;
  status: string;
  total_charges: number;
  currency: string;
  created_at: string;
  service_type: string;
  weight: number;
}

export function ConnotesList() {
  const { toast } = useToast();
  const [connotes, setConnotes] = useState<Connote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConnotes();
  }, []);

  const fetchConnotes = async () => {
    try {
      const { data, error } = await supabase
        .from('connotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch connotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredConnotes = connotes.filter(connote =>
    connote.awb_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connote.shipper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connote.consignee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-primary/10 text-primary';
      case 'processing':
        return 'bg-cargo-orange-light text-cargo-orange';
      case 'in_transit':
        return 'bg-warning-light text-warning';
      case 'delivered':
        return 'bg-success-light text-success';
      case 'returned':
        return 'bg-destructive-light text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handlePrintInvoice = (connote: Connote) => {
    // Navigate to invoice print page
    window.open(`/connotes/${connote.id}/invoice`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Connotes List</h1>
            <p className="text-muted-foreground">Manage all shipment connotes</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/connotes/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Connote
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by AWB, shipper, or consignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Connotes ({filteredConnotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>AWB Number</TableHead>
                  <TableHead>Shipper</TableHead>
                  <TableHead>Consignee</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConnotes.map((connote) => (
                  <TableRow key={connote.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {connote.awb_number}
                    </TableCell>
                    <TableCell>{connote.shipper_name}</TableCell>
                    <TableCell>{connote.consignee_name}</TableCell>
                    <TableCell>
                      {connote.consignee_city}, {connote.consignee_country}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {connote.service_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{connote.weight} kg</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(connote.status)}>
                        {connote.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {connote.currency} {connote.total_charges.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(connote.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/connotes/${connote.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintInvoice(connote)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredConnotes.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No connotes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No connotes match your search criteria.' : 'Get started by creating your first connote.'}
              </p>
              <Button asChild>
                <Link to="/connotes/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Connote
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}