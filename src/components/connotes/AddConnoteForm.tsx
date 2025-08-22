import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, User, MapPin, DollarSign } from 'lucide-react';

interface ConnoteFormData {
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
  shipment_type: 'documents' | 'package' | 'fragile' | 'dangerous';
  service_type: 'express' | 'standard' | 'economy';
  description: string;
  pieces: number;
  weight: number;
  dimensions: string;
  customs_value: number;
  currency: string;
  freight_charges: number;
  fuel_surcharge: number;
  security_charge: number;
  handling_charge: number;
  insurance_fee: number;
  other_charges: number;
}

export function AddConnoteForm() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ConnoteFormData>({
    awb_number: '',
    shipper_name: '',
    shipper_address: '',
    shipper_city: '',
    shipper_country: '',
    shipper_phone: '',
    shipper_email: '',
    consignee_name: '',
    consignee_address: '',
    consignee_city: '',
    consignee_country: '',
    consignee_phone: '',
    consignee_email: '',
    shipment_type: 'package',
    service_type: 'standard',
    description: '',
    pieces: 1,
    weight: 0,
    dimensions: '',
    customs_value: 0,
    currency: 'USD',
    freight_charges: 0,
    fuel_surcharge: 0,
    security_charge: 0,
    handling_charge: 0,
    insurance_fee: 0,
    other_charges: 0,
  });

  const calculateTotal = () => {
    return (
      formData.freight_charges +
      formData.fuel_surcharge +
      formData.security_charge +
      formData.handling_charge +
      formData.insurance_fee +
      formData.other_charges
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const totalCharges = calculateTotal();
      
      const { data, error } = await supabase
        .from('connotes')
        .insert({
          ...formData,
          total_charges: totalCharges,
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Connote ${formData.awb_number} created successfully`,
      });

      navigate('/connotes/list');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create connote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ConnoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-primary p-2 rounded-lg">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Add New Connote</h1>
          <p className="text-muted-foreground">Create a new shipment connote</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="awb_number">AWB Number</Label>
              <Input
                id="awb_number"
                value={formData.awb_number}
                onChange={(e) => updateFormData('awb_number', e.target.value)}
                placeholder="e.g., AWB-2024-001234"
                required
              />
            </div>
            <div>
              <Label htmlFor="service_type">Service Type</Label>
              <Select value={formData.service_type} onValueChange={(value) => updateFormData('service_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shipment_type">Shipment Type</Label>
              <Select value={formData.shipment_type} onValueChange={(value) => updateFormData('shipment_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="fragile">Fragile</SelectItem>
                  <SelectItem value="dangerous">Dangerous Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="e.g., Electronic goods"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipper Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Shipper Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipper_name">Name</Label>
              <Input
                id="shipper_name"
                value={formData.shipper_name}
                onChange={(e) => updateFormData('shipper_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipper_phone">Phone</Label>
              <Input
                id="shipper_phone"
                value={formData.shipper_phone}
                onChange={(e) => updateFormData('shipper_phone', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="shipper_address">Address</Label>
              <Textarea
                id="shipper_address"
                value={formData.shipper_address}
                onChange={(e) => updateFormData('shipper_address', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipper_city">City</Label>
              <Input
                id="shipper_city"
                value={formData.shipper_city}
                onChange={(e) => updateFormData('shipper_city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipper_country">Country</Label>
              <Input
                id="shipper_country"
                value={formData.shipper_country}
                onChange={(e) => updateFormData('shipper_country', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipper_email">Email</Label>
              <Input
                id="shipper_email"
                type="email"
                value={formData.shipper_email}
                onChange={(e) => updateFormData('shipper_email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Consignee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Consignee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consignee_name">Name</Label>
              <Input
                id="consignee_name"
                value={formData.consignee_name}
                onChange={(e) => updateFormData('consignee_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="consignee_phone">Phone</Label>
              <Input
                id="consignee_phone"
                value={formData.consignee_phone}
                onChange={(e) => updateFormData('consignee_phone', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="consignee_address">Address</Label>
              <Textarea
                id="consignee_address"
                value={formData.consignee_address}
                onChange={(e) => updateFormData('consignee_address', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="consignee_city">City</Label>
              <Input
                id="consignee_city"
                value={formData.consignee_city}
                onChange={(e) => updateFormData('consignee_city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="consignee_country">Country</Label>
              <Input
                id="consignee_country"
                value={formData.consignee_country}
                onChange={(e) => updateFormData('consignee_country', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="consignee_email">Email</Label>
              <Input
                id="consignee_email"
                type="email"
                value={formData.consignee_email}
                onChange={(e) => updateFormData('consignee_email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Package Details & Charges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pieces">Pieces</Label>
                  <Input
                    id="pieces"
                    type="number"
                    min="1"
                    value={formData.pieces}
                    onChange={(e) => updateFormData('pieces', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => updateFormData('dimensions', e.target.value)}
                  placeholder="e.g., 30 x 20 x 15 cm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customs_value">Customs Value</Label>
                  <Input
                    id="customs_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.customs_value}
                    onChange={(e) => updateFormData('customs_value', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => updateFormData('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="PKR">PKR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Charges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freight_charges">Freight Charges</Label>
                  <Input
                    id="freight_charges"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.freight_charges}
                    onChange={(e) => updateFormData('freight_charges', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="fuel_surcharge">Fuel Surcharge</Label>
                  <Input
                    id="fuel_surcharge"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fuel_surcharge}
                    onChange={(e) => updateFormData('fuel_surcharge', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="security_charge">Security Charge</Label>
                  <Input
                    id="security_charge"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.security_charge}
                    onChange={(e) => updateFormData('security_charge', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="handling_charge">Handling Charge</Label>
                  <Input
                    id="handling_charge"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.handling_charge}
                    onChange={(e) => updateFormData('handling_charge', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_fee">Insurance Fee</Label>
                  <Input
                    id="insurance_fee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.insurance_fee}
                    onChange={(e) => updateFormData('insurance_fee', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="other_charges">Other Charges</Label>
                  <Input
                    id="other_charges"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.other_charges}
                    onChange={(e) => updateFormData('other_charges', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Charges:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/connotes/list')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Connote'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}