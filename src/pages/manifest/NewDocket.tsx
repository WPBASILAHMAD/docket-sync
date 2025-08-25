import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Save } from 'lucide-react';

export default function NewDocket() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    summary_no: '',
    date: new Date().toISOString().split('T')[0],
    docket_no: '',
    station: '',
    carrier: '',
    flight_no: '',
    bags: '',
    weight: '',
    country: '',
    load_no: '',
    status: 'open' as 'open' | 'closed'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('dockets')
        .insert({
          ...formData,
          bags: formData.bags ? parseInt(formData.bags) : 0,
          weight: formData.weight ? parseFloat(formData.weight) : 0,
          created_by: profile?.id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Docket created successfully',
      });

      // Reset form
      setFormData({
        summary_no: '',
        date: new Date().toISOString().split('T')[0],
        docket_no: '',
        station: '',
        carrier: '',
        flight_no: '',
        bags: '',
        weight: '',
        country: '',
        load_no: '',
        status: 'open'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create docket',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Docket</h1>
          <p className="text-muted-foreground">Create a new shipment docket</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">Docket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="summary_no">Summary No. *</Label>
                <Input
                  id="summary_no"
                  value={formData.summary_no}
                  onChange={(e) => handleInputChange('summary_no', e.target.value)}
                  placeholder="Enter summary number"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docket_no">Docket No. *</Label>
                <Input
                  id="docket_no"
                  value={formData.docket_no}
                  onChange={(e) => handleInputChange('docket_no', e.target.value)}
                  placeholder="Enter docket number"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="station">Station *</Label>
                <Input
                  id="station"
                  value={formData.station}
                  onChange={(e) => handleInputChange('station', e.target.value)}
                  placeholder="Enter station"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier *</Label>
                <Input
                  id="carrier"
                  value={formData.carrier}
                  onChange={(e) => handleInputChange('carrier', e.target.value)}
                  placeholder="Enter carrier name"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flight_no">Flight No.</Label>
                <Input
                  id="flight_no"
                  value={formData.flight_no}
                  onChange={(e) => handleInputChange('flight_no', e.target.value)}
                  placeholder="Enter flight number"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bags">Bags</Label>
                <Input
                  id="bags"
                  type="number"
                  value={formData.bags}
                  onChange={(e) => handleInputChange('bags', e.target.value)}
                  placeholder="Number of bags"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Total weight"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Destination country"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="load_no">Load No.</Label>
                <Input
                  id="load_no"
                  value={formData.load_no}
                  onChange={(e) => handleInputChange('load_no', e.target.value)}
                  placeholder="Enter load number"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    summary_no: '',
                    date: new Date().toISOString().split('T')[0],
                    docket_no: '',
                    station: '',
                    carrier: '',
                    flight_no: '',
                    bags: '',
                    weight: '',
                    country: '',
                    load_no: '',
                    status: 'open'
                  });
                }}
                className="border-border hover:bg-secondary"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Creating...' : 'Create Docket'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}