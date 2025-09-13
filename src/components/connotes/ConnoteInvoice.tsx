import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Printer, Download, ArrowLeft, Package } from 'lucide-react';

interface ConnoteData {
  id: string;
  awb_number: string;
  shipper_name: string;
  shipper_address: string;
  shipper_city: string;
  shipper_country: string;
  shipper_phone: string;
  shipper_email: string;
  consignee_name: string;
  consignee_address: string;
  consignee_city: string;
  consignee_country: string;
  consignee_phone: string;
  consignee_email: string;
  shipment_type: string;
  service_type: string;
  description: string;
  pieces: number;
  weight: number;
  dimensions: string;
  customs_value: number;
  currency: string;
  total_charges: number;
  created_at: string;
  status: string;
}

export function ConnoteInvoice() {
  const { id } = useParams();
  const { toast } = useToast();
  const [connote, setConnote] = useState<ConnoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchConnote();
    }
  }, [id]);

  const fetchConnote = async () => {
    try {
      const { data, error } = await supabase
        .from('connotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setConnote(data as any);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch connote details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, you would generate a PDF here
    toast({
      title: "Download Started",
      description: "Invoice download will be available soon",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!connote) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p>Invoice not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Print Header - Hidden in print */}
      <div className="print:hidden p-4 border-b bg-card">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Invoice - {connote.awb_number}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-8 bg-white print:p-4 print:shadow-none">
        {/* Header Section - Mimicking MEX WORLDWIDE layout */}
        <div className="border-2 border-black">
          {/* Top Header */}
          <div className="border-b-2 border-black p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-primary p-3 rounded">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">DOCKETSYNC</h1>
                  <p className="text-sm text-muted-foreground">CARGO WORLDWIDE EXPRESS</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p><strong>Date:</strong> {new Date(connote.created_at).toLocaleDateString()}</p>
                <p><strong>DOCKETSYNC WORLDWIDE EXP</strong></p>
                <p><strong>Invoice Original Copy</strong></p>
              </div>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="border-b border-black p-4 text-center">
            <div className="font-mono text-3xl tracking-widest mb-2">
              |||||| |||| || |||| |||||| ||||||
            </div>
            <div className="text-xl font-bold tracking-wider">
              {connote.awb_number.replace(/[^0-9]/g, '')}
            </div>
          </div>

          {/* Account and Consignee Info */}
          <div className="flex border-b border-black">
            <div className="w-1/2 p-4 border-r border-black">
              <div className="space-y-2">
                <p><strong>Account No. {connote.id.slice(0, 8).toUpperCase()}</strong></p>
                <p><strong>{connote.shipper_name.toUpperCase()}</strong></p>
                <p>{connote.shipper_address.toUpperCase()}</p>
                <p>{connote.shipper_city.toUpperCase()}</p>
                <p>{connote.shipper_country.toUpperCase()}</p>
                <p>Tel: {connote.shipper_phone}</p>
                <p>Email: {connote.shipper_email}</p>
              </div>
            </div>
            <div className="w-1/2 p-4">
              <div className="space-y-2">
                <p><strong>{connote.consignee_name.toUpperCase()}</strong></p>
                <p>{connote.consignee_address.toUpperCase()}</p>
                <p><strong>{connote.service_type.toUpperCase()} {connote.consignee_city.toUpperCase()}</strong></p>
                <p><strong>{connote.consignee_country.toUpperCase()}</strong></p>
                <p>Tel: {connote.consignee_phone}</p>
                <p>Attention: {connote.consignee_name.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Conditions and Instructions */}
          <div className="border-b border-black p-2 text-xs">
            <p><strong>1- CONDITION OF CARRIAGE:</strong> THE UNDERSIGNED SHIPPER AGREES TO BE BOUND BY THE TERMS & CONDITIONS AND UNDERTAKES ALL RESPONSIBILITIES THAT THERE IS NO ANY CONTRABAND ITEMS, SUCH AS NARCOTICS, DRUGS OR ANY THING WHICH COMES INTO THE JURISDICTION OF ANY OBJECTIONABLE THING.</p>
            <p><strong>2- NOT ABOVE THE CLAIM INVOICE VALUE OR 10% IF LOST OTHERWISE MUST BE INSURED THE GOODS. 3- MEX WORLDWIDE IS NOT RESPONSIBLE FOR BREAKABLE THINGS.</strong></p>
          </div>

          {/* Special Service Section */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/2 p-4 border-r border-black">
                <p><strong>Special Service / Delivery Instructions</strong></p>
              </div>
              <div className="w-1/2"></div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/3 p-4 border-r border-black text-center">
                <p><strong>Shippers Signature</strong></p>
              </div>
              <div className="w-1/3 p-4 border-r border-black text-center">
                <p><strong>Shippers Name</strong></p>
              </div>
              <div className="w-1/3 p-4 text-center">
                <p><strong>Date and Time</strong></p>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="border-b border-black">
            <div className="flex">
              <div className="w-1/4 p-4 border-r border-black">
                <p><strong>NON DOCUMENTS</strong></p>
              </div>
              <div className="w-1/4 p-4 border-r border-black text-center">
                <p><strong>Pieces: {connote.pieces.toString().padStart(2, '0')}</strong></p>
              </div>
              <div className="w-1/4 p-4 border-r border-black text-center">
                <p><strong>Weight: {connote.weight}</strong></p>
              </div>
              <div className="w-1/4 p-4 text-center">
                <p><strong>Dest Code: {connote.consignee_country.toUpperCase()}</strong></p>
              </div>
            </div>
          </div>

          {/* Final Section */}
          <div className="flex">
            <div className="w-1/3 p-4 border-r border-black">
              <p><strong>Ref:</strong></p>
            </div>
            <div className="w-1/3 p-4 border-r border-black">
              <p><strong>Value: {connote.total_charges} {connote.currency}</strong></p>
            </div>
            <div className="w-1/3 p-4 text-center">
              <div className="bg-primary p-2">
                <Package className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-bold text-sm">DOCKETSYNC</p>
                <p className="text-white text-xs">WORLDWIDE</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-black p-4">
            <p><strong>Full Description of Goods: {connote.description.toUpperCase()}</strong></p>
          </div>

          {/* Received Section */}
          <div className="border-t border-black">
            <div className="flex">
              <div className="w-1/2 p-4 border-r border-black">
                <p><strong>Received in Good Order By</strong></p>
                <div className="mt-8 border-t border-black pt-2">
                  <p className="text-center"><strong>Name and Signature</strong></p>
                </div>
              </div>
              <div className="w-1/2 p-4">
                <p><strong>Date and Time</strong></p>
                <div className="mt-8">
                  <div className="bg-primary p-2 text-center">
                    <Package className="h-6 w-6 text-white mx-auto mb-1" />
                    <p className="text-white font-bold text-xs">DOCKETSYNC</p>
                    <p className="text-white text-xs">WORLDWIDE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="mt-6 p-4 bg-secondary/20 rounded-lg print:bg-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold">Status:</p>
              <p className="capitalize">{connote.status.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="font-semibold">Service Type:</p>
              <p className="capitalize">{connote.service_type}</p>
            </div>
            <div>
              <p className="font-semibold">Shipment Type:</p>
              <p className="capitalize">{connote.shipment_type}</p>
            </div>
            <div>
              <p className="font-semibold">Total Charges:</p>
              <p className="font-bold">{connote.currency} {connote.total_charges.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}