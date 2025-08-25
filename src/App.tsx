import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import AddConnote from "./pages/connotes/AddConnote";
import ConnotesList from "./pages/connotes/ConnotesList";
import ConnoteInvoice from "./pages/connotes/ConnoteInvoice";
import NewDocket from "./pages/manifest/NewDocket";
import OpenDockets from "./pages/manifest/OpenDockets";
import ClosedDockets from "./pages/manifest/ClosedDockets";
import UserManagement from "./pages/users/UserManagement";
import TrackingManagement from "./pages/tracking/TrackingManagement";
import Finance from "./pages/finance/Finance";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGuard>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Manifest Routes */}
              <Route path="/manifest/new-docket" element={<NewDocket />} />
              <Route path="/manifest/open" element={<OpenDockets />} />
              <Route path="/manifest/closed" element={<ClosedDockets />} />
              
              {/* Connote Routes */}
              <Route path="/connotes/add" element={<AddConnote />} />
              <Route path="/connotes/list" element={<ConnotesList />} />
              <Route path="/connotes/:id/invoice" element={<ConnoteInvoice />} />
              
              {/* Other Routes */}
              <Route path="/tracking" element={<TrackingManagement />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
