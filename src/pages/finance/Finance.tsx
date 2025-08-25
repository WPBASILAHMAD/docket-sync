import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Lock, TrendingUp, CreditCard, PieChart, BarChart3 } from 'lucide-react';

export default function Finance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg shadow-soft">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance</h1>
            <p className="text-muted-foreground">Financial management and reporting</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm bg-amber-100 text-amber-800 border-amber-200">
          <Lock className="mr-1 h-3 w-3" />
          Early Access
        </Badge>
      </div>

      {/* Early Access Notice */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-soft">
        <CardContent className="p-8 text-center">
          <div className="bg-amber-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Lock className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Finance Module - Early Access</h2>
          <p className="text-amber-700 text-lg mb-6 max-w-2xl mx-auto">
            The Finance module is currently in development and will be available soon. 
            This comprehensive financial management system will include advanced reporting, 
            revenue tracking, expense management, and profit/loss analysis.
          </p>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-amber-200">
            <p className="text-amber-800 font-medium">
              🚀 Coming Soon - Enhanced financial capabilities for your cargo management system
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border shadow-soft opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle className="text-foreground">Revenue Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Monitor revenue streams from shipments, track payment status, and analyze income trends over time.
            </p>
            <div className="mt-4 bg-green-50 p-3 rounded border border-green-200">
              <div className="text-green-800 font-semibold">$0.00</div>
              <div className="text-green-600 text-xs">Total Revenue (Preview)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-foreground">Expense Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Track operational expenses, fuel costs, handling charges, and other business expenses.
            </p>
            <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-200">
              <div className="text-blue-800 font-semibold">$0.00</div>
              <div className="text-blue-600 text-xs">Total Expenses (Preview)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-foreground">Profit & Loss</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Comprehensive P&L reports with detailed breakdowns and performance metrics.
            </p>
            <div className="mt-4 bg-purple-50 p-3 rounded border border-purple-200">
              <div className="text-purple-800 font-semibold">$0.00</div>
              <div className="text-purple-600 text-xs">Net Profit (Preview)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-foreground">Invoice Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Advanced invoicing system with payment tracking, overdue notifications, and automated billing.
            </p>
            <div className="mt-4 bg-orange-50 p-3 rounded border border-orange-200">
              <div className="text-orange-800 font-semibold">0</div>
              <div className="text-orange-600 text-xs">Pending Invoices (Preview)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-foreground">Financial Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Advanced charts and analytics for financial performance, trends, and forecasting.
            </p>
            <div className="mt-4 bg-indigo-50 p-3 rounded border border-indigo-200">
              <div className="text-indigo-800 font-semibold">0%</div>
              <div className="text-indigo-600 text-xs">Growth Rate (Preview)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-teal-600" />
              <CardTitle className="text-foreground">Payment Gateway</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Integrated payment processing with multiple payment methods and automatic reconciliation.
            </p>
            <div className="mt-4 bg-teal-50 p-3 rounded border border-teal-200">
              <div className="text-teal-800 font-semibold">$0.00</div>
              <div className="text-teal-600 text-xs">Processed Payments (Preview)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-soft">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Interested in Early Access?</h3>
          <p className="text-muted-foreground">
            Contact our team to learn more about the upcoming Finance module and get priority access when it launches.
          </p>
          <div className="mt-4 text-sm text-primary font-medium">
            💼 Enterprise features • 📊 Advanced reporting • 🔄 Real-time updates
          </div>
        </CardContent>
      </Card>
    </div>
  );
}